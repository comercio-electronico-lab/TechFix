package handlers

import (
	"net/http"

	"backend/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ProductsHandler struct {
	db *gorm.DB
}

func NewProductsHandler(db *gorm.DB) *ProductsHandler {
	return &ProductsHandler{db: db}
}

// SearchProducts busca productos por nombre, categoría o SKU con caché implícito
// GET /api/products/search?q=pantalla&category=Display&limit=10
func (h *ProductsHandler) SearchProducts(c *gin.Context) {
	query := c.Query("q")
	category := c.Query("category")

	var products []models.Producto
	db := h.db

	// Búsqueda por nombre (case-insensitive)
	if query != "" {
		db = db.Where("LOWER(nombre) ILIKE ? OR LOWER(sku) ILIKE ?", "%"+query+"%", "%"+query+"%")
	}

	// Filtro por categoría
	if category != "" {
		db = db.Where("categoria = ?", category)
	}

	// Filtro por estado comercial (solo activos)
	db = db.Where("estado_comercial = ?", "Activo")

	// Ejecutar búsqueda
	if err := db.Limit(20).Offset(0).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to search products"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"total":    len(products),
		"products": products,
	})
}

// GetProductsByCategory obtiene productos por categoría
// GET /api/products/category/:categoryName?limit=20
func (h *ProductsHandler) GetProductsByCategory(c *gin.Context) {
	category := c.Param("categoryName")

	var products []models.Producto
	if err := h.db.
		Where("categoria = ? AND estado_comercial = ?", category, "Activo").
		Limit(20).
		Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get products"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"category": category,
		"total":    len(products),
		"products": products,
	})
}

// GetCategories obtiene lista de categorías únicas
// GET /api/products/categories
func (h *ProductsHandler) GetCategories(c *gin.Context) {
	var categories []string

	if err := h.db.
		Distinct("categoria").
		Where("estado_comercial = ?", "Activo").
		Model(&models.Producto{}).
		Order("categoria ASC").
		Pluck("categoria", &categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get categories"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"categories": categories,
		"total":      len(categories),
	})
}

// GetProductByID obtiene un producto por ID
// GET /api/products/:productId
func (h *ProductsHandler) GetProductByID(c *gin.Context) {
	productID := c.Param("productId")

	var product models.Producto
	if err := h.db.First(&product, "id = ?", productID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "product not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get product"})
		return
	}

	c.JSON(http.StatusOK, product)
}
