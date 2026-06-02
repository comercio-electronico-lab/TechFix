package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"math/big"
	"net/http"
	"strings"
	"time"

	"backend/internal/db"
	"backend/internal/models"
	"backend/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CheckoutItemInput struct {
	ID       string `json:"id" binding:"required"`
	Quantity int    `json:"quantity" binding:"required,min=1"`
}

type CheckoutContactInput struct {
	FirstName string `json:"firstName" binding:"required"`
	LastName  string `json:"lastName" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
}

type CheckoutShippingInput struct {
	Address string `json:"address" binding:"required"`
	City    string `json:"city" binding:"required"`
	State   string `json:"state" binding:"required"`
	ZipCode string `json:"zipCode" binding:"required"`
}

type CheckoutInput struct {
	Contact       CheckoutContactInput  `json:"contact" binding:"required"`
	Shipping      CheckoutShippingInput `json:"shipping" binding:"required"`
	PaymentMethod string                `json:"payment_method" binding:"required"`
	Items         []CheckoutItemInput   `json:"items" binding:"required,min=1"`
}

func ProcessCheckout(c *gin.Context) {
	var input CheckoutInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos de compra inválidos: " + err.Error()})
		return
	}

	// Verificar si hay autenticación opcional
	var authenticatedUserID *uuid.UUID
	authHeader := c.GetHeader("Authorization")
	if authHeader != "" {
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) == 2 && parts[0] == "Bearer" {
			claims, err := utils.ValidateToken(parts[1])
			if err == nil {
				uid := claims.UserID
				authenticatedUserID = &uid
			}
		}
	}

	// Simular validación externa de pago (Culqi/Izipay)
	refRand, _ := rand.Int(rand.Reader, big.NewInt(99999999))
	reference := fmt.Sprintf("REF-CULQI-%08d", refRand.Int64())

	// Iniciar Transacción de Base de Datos
	tx := db.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	var totalAmount float64
	var orderDetails []models.TransaccionProducto
	var productsToUpdate []models.Producto

	for _, item := range input.Items {
		var product models.Producto
		if err := tx.Where("id = ?", item.ID).First(&product).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Producto con ID %s no encontrado", item.ID)})
			return
		}

		// Validar existencias
		if product.StockActual < item.Quantity {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{
				"error": fmt.Sprintf("Stock insuficiente para '%s'. Solicitado: %d, Disponible: %d", 
					product.Nombre, item.Quantity, product.StockActual),
			})
			return
		}

		subtotal := product.PrecioVenta * float64(item.Quantity)
		totalAmount += subtotal

		// Guardar detalle
		detail := models.TransaccionProducto{
			ID:             uuid.New(),
			ProductoID:     product.ID,
			Cantidad:       item.Quantity,
			PrecioUnitario: product.PrecioVenta,
			Subtotal:       subtotal,
			CreatedAt:      time.Now(),
		}
		orderDetails = append(orderDetails, detail)

		// Actualizar existencias y estado comercial del producto
		product.StockActual -= item.Quantity
		if product.StockActual <= 0 {
			product.EstadoComercial = "Out of Stock"
			product.StockActual = 0
		} else if product.StockActual <= product.StockMinimo {
			product.EstadoComercial = "Low Stock"
		} else {
			product.EstadoComercial = "In Stock"
		}
		productsToUpdate = append(productsToUpdate, product)
	}

	// Calcular Impuestos (IGV/Tax - 8%)
	tax := totalAmount * 0.08
	finalTotal := totalAmount + tax

	// Generar código de Orden
	ordRand1, _ := rand.Int(rand.Reader, big.NewInt(9000))
	ordRand2, _ := rand.Int(rand.Reader, big.NewInt(90000))
	orderNumber := fmt.Sprintf("TF-%d-%dX", ordRand1.Int64()+1000, ordRand2.Int64()+10000)

	// Crear audit log de contacto/envío en el campo de Referencia para invitados
	auditLog := fmt.Sprintf("%s|Cliente: %s %s (%s)|Envío: %s, %s, %s %s",
		reference,
		input.Contact.FirstName, input.Contact.LastName, input.Contact.Email,
		input.Shipping.Address, input.Shipping.City, input.Shipping.State, input.Shipping.ZipCode,
	)

	// Crear Transacción Cabecera
	transaction := models.Transaccion{
		UsuarioID:  authenticatedUserID, // Puede ser nil (Guest/Invitado)
		RepairID:   nil,                 // No aplica a compras e-commerce
		Monto:      finalTotal,
		Metodo:     input.PaymentMethod,
		Estado:     "exitoso",
		Referencia: auditLog,
	}

	if err := tx.Create(&transaction).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al registrar la compra: " + err.Error()})
		return
	}

	// Guardar los detalles asociados a la cabecera y actualizar stock
	for i := range orderDetails {
		orderDetails[i].TransaccionID = transaction.ID
		if err := tx.Create(&orderDetails[i]).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al registrar detalles de la compra: " + err.Error()})
			return
		}
	}

	for _, prod := range productsToUpdate {
		if err := tx.Save(&prod).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar existencias de inventario"})
			return
		}
	}

	// Confirmar Transacción en Base de Datos
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al confirmar la compra en el servidor"})
		return
	}

	// Retornar éxito
	c.JSON(http.StatusCreated, gin.H{
		"orderNumber": orderNumber,
		"total":       finalTotal,
		"subtotal":    totalAmount,
		"tax":         tax,
		"reference":   reference,
		"status":      "success",
	})
}

// Token random helper para el orden number
func generateRandomString(n int) string {
	b := make([]byte, n)
	rand.Read(b)
	return hex.EncodeToString(b)
}
