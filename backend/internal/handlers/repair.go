package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"net/http"
	"time"

	"backend/internal/db"
	"backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateRepairInput struct {
	DeviceID            string  `json:"device_id" binding:"required"`
	PigSessionID        *string `json:"pig_session_id"`
	AppointmentDatetime string  `json:"appointment_datetime" binding:"required"`
	Notes               string  `json:"notes"`
}

type UpdateStatusInput struct {
	Status string `json:"status" binding:"required"`
	Notes  string `json:"notes"`
}

// Genera un token aleatorio seguro de garantía
func generateWarrantyToken() string {
	bytes := make([]byte, 8)
	if _, err := rand.Read(bytes); err != nil {
		return "WARR-" + uuid.New().String()[:8]
	}
	return fmt.Sprintf("WARR-%s", hex.EncodeToString(bytes))
}

// POST /api/repairs - Agendar cita de reparación
func CreateRepairOrder(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autenticado"})
		return
	}

	userID, ok := userIDVal.(uuid.UUID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error de identidad"})
		return
	}

	var input CreateRepairInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}

	// Parsear DeviceID
	parsedDeviceID, err := uuid.Parse(input.DeviceID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de dispositivo inválido"})
		return
	}

	// Validar que el dispositivo pertenezca al usuario
	var device models.Device
	if err := db.DB.Where("id = ? AND user_id = ?", parsedDeviceID, userID).First(&device).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Dispositivo no encontrado o no pertenece a tu perfil"})
		return
	}

	// Parsear AppointmentDatetime soportando múltiples formatos
	var parsedTime time.Time
	parsedTime, err = time.Parse(time.RFC3339, input.AppointmentDatetime)
	if err != nil {
		parsedTime, err = time.Parse("2006-01-02 15:04:05", input.AppointmentDatetime)
		if err != nil {
			parsedTime, err = time.Parse("2006-01-02", input.AppointmentDatetime)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Formato de fecha inválido. Use RFC3339 (YYYY-MM-DDThh:mm:ssZ) o YYYY-MM-DD"})
				return
			}
		}
	}

	// Opcional: Parsear PigSessionID
	var pigSessionID *uuid.UUID
	if input.PigSessionID != nil && *input.PigSessionID != "" {
		parsedSession, err := uuid.Parse(*input.PigSessionID)
		if err == nil {
			pigSessionID = &parsedSession
			// Marcar sesión PIG como convertida
			db.DB.Model(&models.PigSession{}).Where("id = ?", parsedSession).Update("converted_to_order", true)
		}
	}

	// Crear la orden de reparación
	order := models.RepairOrder{
		UserID:              userID,
		DeviceID:            parsedDeviceID,
		PigSessionID:        pigSessionID,
		AppointmentDatetime: parsedTime,
		Status:              "pending",
		Notes:               input.Notes,
	}

	if err := db.DB.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear la orden de reparación: " + err.Error()})
		return
	}

	// Crear el primer registro de tracking
	tracking := models.RepairTracking{
		RepairID:       order.ID,
		PreviousStatus: "",
		NewStatus:      "pending",
		ChangedBy:      userID,
		Notes:          "Solicitud de asistencia técnica agendada por el cliente.",
	}
	db.DB.Create(&tracking)

	c.JSON(http.StatusCreated, order)
}

// GET /api/repairs - Obtener lista de reparaciones del cliente
func GetClientRepairOrders(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autenticado"})
		return
	}

	userID, ok := userIDVal.(uuid.UUID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error de identidad"})
		return
	}

	var orders []models.RepairOrder
	if err := db.DB.Preload("Device").Where("user_id = ?", userID).Order("created_at desc").Find(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener órdenes de reparación: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, orders)
}

// GET /api/repairs/:id - Obtener detalles de orden con su tracking y garantía
func GetRepairDetails(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autenticado"})
		return
	}

	userID, ok := userIDVal.(uuid.UUID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error de identidad"})
		return
	}

	repairID := c.Param("id")
	if repairID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de reparación requerido"})
		return
	}

	parsedRepairID, err := uuid.Parse(repairID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de reparación inválido"})
		return
	}

	// Buscar orden de reparación
	var order models.RepairOrder
	if err := db.DB.Preload("Device").Where("id = ? AND user_id = ?", parsedRepairID, userID).First(&order).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Orden de reparación no encontrada"})
		return
	}

	// Obtener logs de seguimiento técnico ordenados por fecha ascendente
	var tracking []models.RepairTracking
	if err := db.DB.Where("repair_id = ?", parsedRepairID).Order("created_at asc").Find(&tracking).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al recuperar logs de seguimiento"})
		return
	}

	// Buscar garantía asociada si existe
	var warranty models.Warranty
	hasWarranty := false
	if err := db.DB.Where("repair_id = ?", parsedRepairID).First(&warranty).Error; err == nil {
		hasWarranty = true
	}

	response := gin.H{
		"order":    order,
		"tracking": tracking,
	}
	if hasWarranty {
		response["warranty"] = warranty
	} else {
		response["warranty"] = nil
	}

	c.JSON(http.StatusOK, response)
}

// GET /api/warranties - Obtener garantías digitales del cliente
func GetClientWarranties(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autenticado"})
		return
	}

	userID, ok := userIDVal.(uuid.UUID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error de identidad"})
		return
	}

	var warranties []models.Warranty
	if err := db.DB.Preload("Device").Preload("RepairOrder").Where("user_id = ?", userID).Order("end_date desc").Find(&warranties).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener garantías: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, warranties)
}

// PUT /api/admin/repairs/:id/status - Actualizar estado e insertar log + auto-garantía
func UpdateRepairStatus(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autenticado"})
		return
	}

	userID, ok := userIDVal.(uuid.UUID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error de identidad"})
		return
	}

	repairID := c.Param("id")
	parsedRepairID, err := uuid.Parse(repairID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de reparación inválido"})
		return
	}

	var input UpdateStatusInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}

	// Iniciar una transacción para asegurar atomicidad
	tx := db.DB.Begin()

	var order models.RepairOrder
	if err := tx.Where("id = ?", parsedRepairID).First(&order).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "Orden de reparación no encontrada"})
		return
	}

	oldStatus := order.Status
	order.Status = input.Status

	// Guardar la orden actualizada
	if err := tx.Save(&order).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al guardar el nuevo estado: " + err.Error()})
		return
	}

	// Insertar log de auditoría de tracking
	tracking := models.RepairTracking{
		RepairID:       order.ID,
		PreviousStatus: oldStatus,
		NewStatus:      input.Status,
		ChangedBy:      userID,
		Notes:          input.Notes,
	}
	if err := tx.Create(&tracking).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al registrar auditoría de estado: " + err.Error()})
		return
	}

	var generatedWarranty *models.Warranty = nil

	// Auto-generación de garantía digital si pasa a "ready" (Listo) o "delivered" (Entregado)
	if input.Status == "ready" || input.Status == "delivered" {
		var existingWarranty models.Warranty
		err = tx.Where("repair_id = ?", parsedRepairID).First(&existingWarranty).Error
		if err != nil { // No existe, se genera
			token := generateWarrantyToken()
			now := time.Now()
			warranty := models.Warranty{
				RepairID:      order.ID,
				UserID:        order.UserID,
				DeviceID:      order.DeviceID,
				WarrantyDays:  90,
				StartDate:     now,
				EndDate:       now.AddDate(0, 0, 90),
				IsActive:      true,
				WarrantyToken: token,
			}
			if err := tx.Create(&warranty).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al generar la garantía del dispositivo: " + err.Error()})
				return
			}
			generatedWarranty = &warranty
		} else {
			generatedWarranty = &existingWarranty
		}
	}

	tx.Commit()

	response := gin.H{
		"order":    order,
		"tracking": tracking,
	}
	if generatedWarranty != nil {
		response["warranty"] = generatedWarranty
	} else {
		response["warranty"] = nil
	}

	c.JSON(http.StatusOK, response)
}
