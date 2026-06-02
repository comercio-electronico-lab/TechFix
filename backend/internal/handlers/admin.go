package handlers

import (
	"fmt"
	"net/http"
	"time"

	"backend/internal/db"
	"backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AddPartInput struct {
	ProductoID string `json:"producto_id" binding:"required"`
	Cantidad   int    `json:"cantidad" binding:"required"`
}

type UpdateProductInput struct {
	Nombre          string  `json:"nombre"`
	Descripcion     string  `json:"descripcion"`
	PrecioVenta     float64 `json:"precio_venta"`
	PrecioCosto     float64 `json:"precio_costo"`
	StockActual     int     `json:"stock_actual"`
	StockMinimo     int     `json:"stock_minimo"`
	EstadoComercial string  `json:"estado_comercial"`
}

type CreateProductInput struct {
	Nombre          string  `json:"nombre" binding:"required"`
	Descripcion     string  `json:"descripcion"`
	SKU             string  `json:"sku" binding:"required"`
	PrecioVenta     float64 `json:"precio_venta" binding:"required"`
	PrecioCosto     float64 `json:"precio_costo"`
	StockActual     int     `json:"stock_actual"`
	StockMinimo     int     `json:"stock_minimo"`
	Categoria       string  `json:"categoria" binding:"required"`
}

type CreateSupplierOrderInput struct {
	ProveedorID string  `json:"proveedor_id" binding:"required"`
	ProductoID  string  `json:"producto_id" binding:"required"`
	Cantidad    int     `json:"cantidad" binding:"required"`
	RepairID    *string `json:"repair_id"`
}

// GET /api/admin/repairs - Obtener todas las reparaciones para el Kanban
func GetAdminRepairs(c *gin.Context) {
	var orders []models.RepairOrder
	err := db.DB.Preload("Device").Preload("User").Order("updated_at desc").Find(&orders).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al recuperar reparaciones: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, orders)
}

// POST /api/admin/repairs/:id/parts - Asociar repuesto usado en la reparación
func AddRepairProduct(c *gin.Context) {
	repairID := c.Param("id")
	parsedRepairID, err := uuid.Parse(repairID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de reparación inválido"})
		return
	}

	var input AddPartInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}

	parsedProductID, err := uuid.Parse(input.ProductoID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de producto inválido"})
		return
	}

	userIDVal, _ := c.Get("userID")
	userID := userIDVal.(uuid.UUID)

	// Iniciar Transacción
	tx := db.DB.Begin()

	// 1. Obtener la orden de reparación
	var order models.RepairOrder
	if err := tx.Where("id = ?", parsedRepairID).First(&order).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "Orden de reparación no encontrada"})
		return
	}

	// 2. Obtener el producto de inventario
	var product models.Producto
	if err := tx.Where("id = ?", parsedProductID).First(&product).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "Producto no encontrado en inventario"})
		return
	}

	// 3. Verificar si hay stock actual
	if product.StockActual < input.Cantidad {
		tx.Rollback()
		c.JSON(http.StatusConflict, gin.H{
			"error":        "Stock insuficiente",
			"stock_actual": product.StockActual,
		})
		return
	}

	// 4. Descontar stock actual
	product.StockActual -= input.Cantidad
	// Actualizar alertas comerciales
	if product.StockActual == 0 {
		product.EstadoComercial = "Out of Stock"
	} else if product.StockActual <= product.StockMinimo {
		product.EstadoComercial = "Low Stock"
	}

	if err := tx.Save(&product).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar stock de inventario: " + err.Error()})
		return
	}

	// 5. Vincular a la tabla intermedia
	subtotal := float64(input.Cantidad) * product.PrecioVenta
	link := models.RepairOrderProducto{
		ID:             uuid.New(),
		RepairID:       order.ID,
		ProductoID:     product.ID,
		Cantidad:       input.Cantidad,
		PrecioUnitario: product.PrecioVenta,
		Subtotal:       subtotal,
		CreatedAt:      time.Now(),
	}

	if err := tx.Create(&link).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al vincular el componente a la orden: " + err.Error()})
		return
	}

	// 6. Recalcular e incrementar precio final
	order.FinalPrice += subtotal
	if err := tx.Save(&order).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar costo final de la reparación"})
		return
	}

	// 7. Insertar log en el historial de tracking
	notes := "Se asoció el repuesto '" + product.Nombre + "' x" + string(rune(input.Cantidad+'0')) + " a la reparación. Costo añadido: $" + fmt.Sprintf("%.2f", subtotal) + " USD."
	if input.Cantidad > 9 { // Para formatear números grandes
		notes = "Se asoció el repuesto '" + product.Nombre + "' (Cantidad: " + string(rune(input.Cantidad)) + ") a la reparación. Costo añadido."
	}
	// Corrección de string simple
	notes = "Se asoció el repuesto '" + product.Nombre + "' (x" + fmt.Sprintf("%d", input.Cantidad) + ") a la reparación. Costo añadido: $" + fmt.Sprintf("%.2f", subtotal) + " USD."

	tracking := models.RepairTracking{
		RepairID:       order.ID,
		PreviousStatus: order.Status,
		NewStatus:      order.Status,
		ChangedBy:      userID,
		Notes:          notes,
	}
	tx.Create(&tracking)

	tx.Commit()

	c.JSON(http.StatusOK, gin.H{
		"order":            order,
		"added_part":       link,
		"product_updated":  product,
	})
}

// GET /api/admin/products - Lista completa de inventario
func GetAdminProducts(c *gin.Context) {
	var products []models.Producto
	if err := db.DB.Order("categoria asc, nombre asc").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al recuperar inventario: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, products)
}

// PUT /api/admin/products/:id - Editar precios y niveles de stock
func UpdateProduct(c *gin.Context) {
	prodID := c.Param("id")
	parsedProdID, err := uuid.Parse(prodID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de producto inválido"})
		return
	}

	var input UpdateProductInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}

	var product models.Producto
	if err := db.DB.Where("id = ?", parsedProdID).First(&product).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Producto no encontrado"})
		return
	}

	// Actualizar campos
	if input.Nombre != "" {
		product.Nombre = input.Nombre
	}
	if input.Descripcion != "" {
		product.Descripcion = input.Descripcion
	}
	if input.PrecioVenta > 0 {
		product.PrecioVenta = input.PrecioVenta
	}
	if input.PrecioCosto > 0 {
		product.PrecioCosto = input.PrecioCosto
	}
	product.StockActual = input.StockActual
	if input.StockMinimo > 0 {
		product.StockMinimo = input.StockMinimo
	}

	// Recalcular alertas comerciales
	if product.StockActual == 0 {
		product.EstadoComercial = "Out of Stock"
	} else if product.StockActual <= product.StockMinimo {
		product.EstadoComercial = "Low Stock"
	} else {
		product.EstadoComercial = "In Stock"
	}

	if err := db.DB.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar producto: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, product)
}

// POST /api/admin/products - Registrar nuevo repuesto/producto en el catálogo
func CreateProduct(c *gin.Context) {
	var input CreateProductInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}

	// Verificar si el SKU ya existe
	var existing models.Producto
	if err := db.DB.Where("sku = ?", input.SKU).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "El SKU especificado ya existe en el catálogo"})
		return
	}

	status := "In Stock"
	if input.StockActual == 0 {
		status = "Out of Stock"
	} else if input.StockActual <= input.StockMinimo {
		status = "Low Stock"
	}

	product := models.Producto{
		Nombre:          input.Nombre,
		Descripcion:     input.Descripcion,
		SKU:             input.SKU,
		PrecioVenta:     input.PrecioVenta,
		PrecioCosto:     input.PrecioCosto,
		StockActual:     input.StockActual,
		StockMinimo:     input.StockMinimo,
		Categoria:       input.Categoria,
		EstadoComercial: status,
	}

	if err := db.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al registrar el producto: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, product)
}

// GET /api/admin/suppliers - Listar mayoristas
func GetSuppliers(c *gin.Context) {
	var suppliers []models.Proveedor
	if err := db.DB.Order("nombre asc").Find(&suppliers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al listar mayoristas: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, suppliers)
}

// POST /api/admin/supplier-orders - Generar pedido a mayorista
func CreateSupplierOrder(c *gin.Context) {
	var input CreateSupplierOrderInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos del pedido inválidos: " + err.Error()})
		return
	}

	parsedSupplierID, err := uuid.Parse(input.ProveedorID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de proveedor inválido"})
		return
	}

	parsedProductID, err := uuid.Parse(input.ProductoID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de producto inválido"})
		return
	}

	// Verificar mayorista
	var supplier models.Proveedor
	if err := db.DB.Where("id = ?", parsedSupplierID).First(&supplier).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Proveedor mayorista no encontrado"})
		return
	}

	// Verificar producto
	var product models.Producto
	if err := db.DB.Where("id = ?", parsedProductID).First(&product).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Producto de inventario no encontrado"})
		return
	}

	var repairID *uuid.UUID
	if input.RepairID != nil && *input.RepairID != "" {
		pID, err := uuid.Parse(*input.RepairID)
		if err == nil {
			repairID = &pID
		}
	}

	order := models.PedidoRepuesto{
		ProveedorID: parsedSupplierID,
		ProductoID:  parsedProductID,
		RepairID:    repairID,
		Cantidad:    input.Cantidad,
		Estado:      "solicitado",
	}

	if err := db.DB.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al generar pedido a mayorista: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, order)
}

// GET /api/admin/supplier-orders - Listar todos los pedidos de repuesto generados
func GetSupplierOrders(c *gin.Context) {
	var orders []models.PedidoRepuesto
	if err := db.DB.Preload("Proveedor").Preload("Producto").Order("created_at desc").Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al listar pedidos de repuestos: " + err.Error()})
		return
	}
	c.JSON(http.StatusOK, orders)
}
