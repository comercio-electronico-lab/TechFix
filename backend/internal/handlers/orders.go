package handlers

import (
	"fmt"
	"net/http"

	"backend/internal/db"
	"backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OrderItemInput struct {
	ProductoID string `json:"producto_id" binding:"required"`
	Cantidad   int    `json:"cantidad" binding:"required,gt=0"`
}

type CreateOrderInput struct {
	PaymentID      string           `json:"payment_id" binding:"required"`
	Items          []OrderItemInput `json:"items" binding:"required,min=1"`
	NombreEnvio    string           `json:"nombre_envio"`
	DireccionEnvio string           `json:"direccion_envio"`
	CiudadEnvio    string           `json:"ciudad_envio"`
	TelefonoEnvio  string           `json:"telefono_envio"`
	Envio          float64          `json:"envio"`
	Impuestos      float64          `json:"impuestos"`
}

// CreateOrder persiste un pedido de catálogo: descuenta stock, guarda items y dirección de envío.
// POST /api/orders
func CreateOrder(c *gin.Context) {
	var input CreateOrderInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "usuario no autenticado"})
		return
	}
	userUUID := userID.(uuid.UUID)

	paymentUUID, err := uuid.Parse(input.PaymentID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "payment_id inválido"})
		return
	}

	var paymentRecord models.Payment
	if err := db.DB.First(&paymentRecord, "id = ? AND user_id = ?", paymentUUID, userUUID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "pago no encontrado"})
		return
	}

	if paymentRecord.Status != "approved" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "El pago asociado a este pedido no ha sido aprobado"})
		return
	}

	// Idempotencia por payment_id: si el pedido ya fue creado para este pago (reintento
	// del frontend tras perder la respuesta por un corte de red, doble clic, etc.),
	// devolvemos el existente en vez de duplicar el pedido y descontar el stock dos veces.
	var existingPedido models.Pedido
	if err := db.DB.Preload("Items.Producto").Where("payment_id = ?", paymentUUID).First(&existingPedido).Error; err == nil {
		c.JSON(http.StatusOK, existingPedido)
		return
	}

	tx := db.DB.Begin()

	var subtotal float64
	var lineItems []models.PedidoProducto

	for _, item := range input.Items {
		productoUUID, err := uuid.Parse(item.ProductoID)
		if err != nil {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("producto_id inválido: %s", item.ProductoID)})
			return
		}

		var producto models.Producto
		if err := tx.First(&producto, "id = ?", productoUUID).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("producto no encontrado: %s", item.ProductoID)})
			return
		}

		// Descuento atómico condicionado al stock disponible: el chequeo y la resta
		// ocurren en una sola sentencia SQL, evitando que dos pedidos concurrentes
		// lean el mismo stock y ambos pasen la validación (oversell).
		result := tx.Model(&models.Producto{}).
			Where("id = ? AND stock_actual >= ?", productoUUID, item.Cantidad).
			Update("stock_actual", gorm.Expr("stock_actual - ?", item.Cantidad))
		if result.Error != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error al actualizar stock"})
			return
		}
		if result.RowsAffected == 0 {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("stock insuficiente para %s", producto.Nombre)})
			return
		}

		lineSubtotal := producto.PrecioVenta * float64(item.Cantidad)
		subtotal += lineSubtotal

		lineItems = append(lineItems, models.PedidoProducto{
			ProductoID:     productoUUID,
			Cantidad:       item.Cantidad,
			PrecioUnitario: producto.PrecioVenta,
			Subtotal:       lineSubtotal,
		})
	}

	pedido := models.Pedido{
		UsuarioID:      userUUID,
		PaymentID:      &paymentUUID,
		Estado:         "pagado",
		Subtotal:       subtotal,
		Envio:          input.Envio,
		Impuestos:      input.Impuestos,
		Total:          subtotal + input.Envio + input.Impuestos,
		NombreEnvio:    input.NombreEnvio,
		DireccionEnvio: input.DireccionEnvio,
		CiudadEnvio:    input.CiudadEnvio,
		TelefonoEnvio:  input.TelefonoEnvio,
	}
	if err := tx.Create(&pedido).Error; err != nil {
		tx.Rollback()
		// Si el INSERT falló por la restricción unique de payment_id (dos reintentos
		// concurrentes para el mismo pago corriendo a la vez), el pedido ya existe:
		// devolverlo en vez de fallar con 500.
		var raced models.Pedido
		if lookupErr := db.DB.Preload("Items.Producto").Where("payment_id = ?", paymentUUID).First(&raced).Error; lookupErr == nil {
			c.JSON(http.StatusOK, raced)
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error al crear el pedido"})
		return
	}

	for i := range lineItems {
		lineItems[i].PedidoID = pedido.ID
	}
	if err := tx.Create(&lineItems).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error al registrar los items del pedido"})
		return
	}

	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error al confirmar el pedido"})
		return
	}

	pedido.Items = lineItems
	c.JSON(http.StatusCreated, pedido)
}

// GetUserOrders devuelve el historial de pedidos del usuario autenticado.
// GET /api/orders/me
func GetUserOrders(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "usuario no autenticado"})
		return
	}
	userUUID := userID.(uuid.UUID)

	var pedidos []models.Pedido
	if err := db.DB.Preload("Items.Producto").Where("usuario_id = ?", userUUID).Order("created_at DESC").Find(&pedidos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error al obtener pedidos"})
		return
	}

	c.JSON(http.StatusOK, pedidos)
}

// GetOrderByID devuelve el detalle de un pedido puntual.
// GET /api/orders/:id
func GetOrderByID(c *gin.Context) {
	orderID := c.Param("id")

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "usuario no autenticado"})
		return
	}
	userUUID := userID.(uuid.UUID)

	var pedido models.Pedido
	if err := db.DB.Preload("Items.Producto").First(&pedido, "id = ? AND usuario_id = ?", orderID, userUUID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "pedido no encontrado"})
		return
	}

	c.JSON(http.StatusOK, pedido)
}
