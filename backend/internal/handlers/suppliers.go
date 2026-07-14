package handlers

import (
	"net/http"
	"time"

	"backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SuppliersHandler struct {
	db *gorm.DB
}

func NewSuppliersHandler(db *gorm.DB) *SuppliersHandler {
	return &SuppliersHandler{db: db}
}

// GetSuppliers devuelve la lista de proveedores (y si está vacía, crea algunos por defecto)
// GET /api/suppliers
func (h *SuppliersHandler) GetSuppliers(c *gin.Context) {
	var suppliers []models.Proveedor
	h.db.Find(&suppliers)

	if len(suppliers) == 0 {
		// Crear proveedores por defecto si no existen
		defaultSuppliers := []models.Proveedor{
			{
				Nombre:   "TechParts Global",
				Contacto: "Alex Johnson",
				Telefono: "+1-555-0199",
				Email:    "sales@techparts-global.com",
			},
			{
				Nombre:   "Express Screens Ltd",
				Contacto: "Maria Gomez",
				Telefono: "+34-91-123456",
				Email:    "orders@express-screens.es",
			},
			{
				Nombre:   "Silicon Valley Components",
				Contacto: "David Lee",
				Telefono: "+1-408-555-0142",
				Email:    "wholesale@svc-components.com",
			},
		}

		for i := range defaultSuppliers {
			defaultSuppliers[i].ID = uuid.New()
			h.db.Create(&defaultSuppliers[i])
		}
		suppliers = defaultSuppliers
	}

	c.JSON(http.StatusOK, suppliers)
}

type CreateRestockOrderRequest struct {
	ProveedorID string `json:"proveedor_id" binding:"required"`
	ProductoID  string `json:"producto_id" binding:"required"`
	Cantidad    int    `json:"cantidad" binding:"required"`
}

// CreateRestockOrder crea un nuevo pedido de repuesto
// POST /api/suppliers/orders
func (h *SuppliersHandler) CreateRestockOrder(c *gin.Context) {
	var req CreateRestockOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	provUUID, err := uuid.Parse(req.ProveedorID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid proveedor_id"})
		return
	}

	prodUUID, err := uuid.Parse(req.ProductoID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid producto_id"})
		return
	}

	eta := time.Now().AddDate(0, 0, 7) // 7 days delivery

	order := models.PedidoRepuesto{
		ProveedorID:  provUUID,
		ProductoID:   prodUUID,
		Cantidad:     req.Cantidad,
		Estado:       "solicitado",
		FechaLlegada: &eta,
	}
	order.ID = uuid.New()

	if err := h.db.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create restock order"})
		return
	}

	// Cargar relaciones para la respuesta
	h.db.Preload("Proveedor").Preload("Producto").First(&order, "id = ?", order.ID)

	c.JSON(http.StatusCreated, order)
}

// CreateSupplier crea un nuevo proveedor (Admin only)
func (h *SuppliersHandler) CreateSupplier(c *gin.Context) {
	var input models.Proveedor
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	input.ID = uuid.New()
	if err := h.db.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al registrar el proveedor"})
		return
	}

	c.JSON(http.StatusCreated, input)
}

// UpdateSupplier actualiza un proveedor existente (Admin only)
func (h *SuppliersHandler) UpdateSupplier(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de proveedor inválido"})
		return
	}

	var input models.Proveedor
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var supplier models.Proveedor
	if err := h.db.First(&supplier, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Proveedor no encontrado"})
		return
	}

	supplier.Nombre = input.Nombre
	supplier.Contacto = input.Contacto
	supplier.Telefono = input.Telefono
	supplier.Email = input.Email

	if err := h.db.Save(&supplier).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar el proveedor"})
		return
	}

	c.JSON(http.StatusOK, supplier)
}

// DeleteSupplier elimina un proveedor existente (Admin only)
func (h *SuppliersHandler) DeleteSupplier(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de proveedor inválido"})
		return
	}

	var supplier models.Proveedor
	if err := h.db.First(&supplier, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Proveedor no encontrado"})
		return
	}

	if err := h.db.Delete(&supplier).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar el proveedor"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Proveedor eliminado con éxito"})
}
