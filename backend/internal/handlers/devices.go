package handlers

import (
	"net/http"
	"time"

	"backend/internal/db"
	"backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// DeviceInput represents input payload for creating/updating a device
type DeviceInput struct {
	Brand        string `json:"brand" binding:"required"`
	Model        string `json:"model" binding:"required"`
	SerialNumber string `json:"serial_number" binding:"required"`
	DeviceType   string `json:"device_type" binding:"required"`
	PurchaseDate string `json:"purchase_date"` // YYYY-MM-DD format
}

// GetDevices returns all devices for the authenticated user
func GetDevices(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
		return
	}
	userID := userIDVal.(uuid.UUID)

	var devices []models.Device
	if err := db.DB.Where("user_id = ?", userID).Find(&devices).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al consultar dispositivos"})
		return
	}

	c.JSON(http.StatusOK, devices)
}

// CreateDevice registers a new device for the authenticated user
func CreateDevice(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
		return
	}
	userID := userIDVal.(uuid.UUID)

	var input DeviceInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verificar si ya existe el número de serie
	var existing models.Device
	if err := db.DB.Where("serial_number = ?", input.SerialNumber).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "El número de serie ya está registrado por otro equipo"})
		return
	}

	var pDate *time.Time
	if input.PurchaseDate != "" {
		parsedDate, err := time.Parse("2006-01-02", input.PurchaseDate)
		if err == nil {
			pDate = &parsedDate
		}
	}

	device := models.Device{
		UserID:       userID,
		Brand:        input.Brand,
		Model:        input.Model,
		SerialNumber: input.SerialNumber,
		DeviceType:   input.DeviceType,
		PurchaseDate: pDate,
	}

	if err := db.DB.Create(&device).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al registrar el dispositivo"})
		return
	}

	c.JSON(http.StatusCreated, device)
}

// UpdateDevice updates an existing device owned by the authenticated user
func UpdateDevice(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
		return
	}
	userID := userIDVal.(uuid.UUID)

	deviceIDStr := c.Param("id")
	deviceID, err := uuid.Parse(deviceIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de dispositivo inválido"})
		return
	}

	var input DeviceInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var device models.Device
	if err := db.DB.Where("id = ? AND user_id = ?", deviceID, userID).First(&device).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Dispositivo no encontrado o no autorizado para modificarlo"})
		return
	}

	// Verificar si el número de serie se cambió a uno que ya pertenece a otro dispositivo
	var otherDevice models.Device
	if err := db.DB.Where("serial_number = ? AND id != ?", input.SerialNumber, deviceID).First(&otherDevice).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "El número de serie ya está registrado por otro equipo"})
		return
	}

	var pDate *time.Time
	if input.PurchaseDate != "" {
		parsedDate, err := time.Parse("2006-01-02", input.PurchaseDate)
		if err == nil {
			pDate = &parsedDate
		}
	}

	device.Brand = input.Brand
	device.Model = input.Model
	device.SerialNumber = input.SerialNumber
	device.DeviceType = input.DeviceType
	device.PurchaseDate = pDate

	if err := db.DB.Save(&device).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar el dispositivo"})
		return
	}

	c.JSON(http.StatusOK, device)
}

// DeleteDevice deletes a device owned by the authenticated user
func DeleteDevice(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
		return
	}
	userID := userIDVal.(uuid.UUID)

	deviceIDStr := c.Param("id")
	deviceID, err := uuid.Parse(deviceIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de dispositivo inválido"})
		return
	}

	var device models.Device
	if err := db.DB.Where("id = ? AND user_id = ?", deviceID, userID).First(&device).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Dispositivo no encontrado o no autorizado para eliminarlo"})
		return
	}

	if err := db.DB.Delete(&device).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar el dispositivo"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Dispositivo eliminado exitosamente"})
}
