package handlers

import (
	"net/http"

	"backend/internal/db"
	"backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetPigNodes returns PIG decision tree nodes based on device_type and parent_node_id
func GetPigNodes(c *gin.Context) {
	deviceType := c.Query("device_type")
	if deviceType == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "El parámetro device_type es requerido"})
		return
	}

	parentIDStr := c.Query("parent_id")

	var nodes []models.PigNode
	query := db.DB.Where("device_type = ?", deviceType)

	if parentIDStr == "" {
		// Consultar el nodo raíz (donde parent_node_id es NULL)
		query = query.Where("parent_node_id IS NULL")
	} else {
		parentID, err := uuid.Parse(parentIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "ID de nodo padre inválido"})
			return
		}
		query = query.Where("parent_node_id = ?", parentID)
	}

	if err := query.Order("order_index asc").Find(&nodes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al consultar los nodos PIG"})
		return
	}

	c.JSON(http.StatusOK, nodes)
}
