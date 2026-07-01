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
