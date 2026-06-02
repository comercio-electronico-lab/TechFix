package handlers

import (
	"net/http"

	"backend/internal/db"
	"backend/internal/models"
	"github.com/gin-gonic/gin"
)

func GetProducts(c *gin.Context) {
	var productos []models.Producto
	
	// Cargar todos los productos que no estén "Out of Stock" o simplemente todos para que el cliente filtre
	if err := db.DB.Order("nombre asc").Find(&productos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener catálogo de productos: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, productos)
}

func GetProductByID(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID del producto requerido"})
		return
	}

	var producto models.Producto
	if err := db.DB.Where("id = ?", id).First(&producto).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Producto no encontrado"})
		return
	}

	c.JSON(http.StatusOK, producto)
}
