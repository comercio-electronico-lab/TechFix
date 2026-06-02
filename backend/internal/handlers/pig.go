package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"backend/internal/db"
	"backend/internal/models"
	"backend/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type SavePigSessionInput struct {
	DeviceID       *string  `json:"device_id"`
	TerminalNodeID string   `json:"terminal_node_id" binding:"required"`
	SymptomPath    []string `json:"symptom_path" binding:"required"`
}

func StartDiagnostic(c *gin.Context) {
	deviceType := c.Query("device_type")
	if deviceType == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "El tipo de dispositivo (device_type) es requerido"})
		return
	}

	// Buscar el nodo raíz para el tipo de dispositivo
	var rootNode models.PigNode
	if err := db.DB.Where("parent_node_id IS NULL AND device_type = ?", deviceType).First(&rootNode).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Árbol de diagnóstico no encontrado para este tipo de dispositivo"})
		return
	}

	// Buscar las opciones asociadas (nodos hijos)
	var options []models.PigNode
	if err := db.DB.Where("parent_node_id = ?", rootNode.ID).Order("order_index asc").Find(&options).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al buscar opciones de diagnóstico: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"current_node": rootNode,
		"options":      options,
	})
}

func GetDiagnosticNode(c *gin.Context) {
	nodeID := c.Param("id")
	if nodeID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID del nodo requerido"})
		return
	}

	var node models.PigNode
	if err := db.DB.Where("id = ?", nodeID).First(&node).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Paso de diagnóstico no encontrado"})
		return
	}

	var options []models.PigNode
	if !node.IsTerminal {
		// Buscar las opciones asociadas (nodos hijos)
		if err := db.DB.Where("parent_node_id = ?", node.ID).Order("order_index asc").Find(&options).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al buscar opciones de diagnóstico: " + err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"current_node": node,
		"options":      options,
	})
}

func SaveDiagnosticSession(c *gin.Context) {
	var input SavePigSessionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos de sesión de diagnóstico inválidos: " + err.Error()})
		return
	}

	// Identificar opcionalmente al usuario si está autenticado
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

	// Buscar el nodo terminal seleccionado
	var terminalNode models.PigNode
	if err := db.DB.Where("id = ?", input.TerminalNodeID).First(&terminalNode).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Paso terminal de diagnóstico no encontrado"})
		return
	}

	// Convertir path de síntomas a bytes JSON
	symptomPathBytes, err := json.Marshal(input.SymptomPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar el historial de diagnóstico"})
		return
	}

	// Parsear DeviceID opcional
	var devID *uuid.UUID
	if input.DeviceID != nil && *input.DeviceID != "" {
		parsed, err := uuid.Parse(*input.DeviceID)
		if err == nil {
			devID = &parsed
		}
	}

	// Crear sesión
	session := models.PigSession{
		UserID:               authenticatedUserID,
		DeviceID:             devID,
		SymptomPath:          symptomPathBytes,
		PreliminaryDiagnosis: terminalNode.PreliminaryResult,
		EstimatedPriceMin:    terminalNode.EstimatedMin,
		EstimatedPriceMax:    terminalNode.EstimatedMax,
		ConvertedToOrder:     false,
	}

	if err := db.DB.Create(&session).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al guardar el diagnóstico en el historial: " + err.Error()})
		return
	}

	// Consultar repuestos recomendados en inventario
	var recommendedProducts []models.Producto
	err = db.DB.Table("productos").
		Joins("JOIN pig_node_producto ON productos.id = pig_node_producto.producto_id").
		Where("pig_node_producto.pig_node_id = ?", terminalNode.ID).
		Find(&recommendedProducts).Error
	if err != nil {
		log.Printf("Advertencia: no se pudieron cargar los repuestos recomendados: %v\n", err)
	}

	c.JSON(http.StatusCreated, gin.H{
		"session":            session,
		"suggested_products": recommendedProducts,
	})
}
