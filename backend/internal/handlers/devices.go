package handlers

import (
	"net/http"
	"strings"
	"time"

	"backend/internal/db"
	"backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type CreateDeviceInput struct {
	Brand        string `json:"brand" binding:"required"`
	Model        string `json:"model" binding:"required"`
	SerialNumber string `json:"serial_number" binding:"required"`
	Specs        string `json:"specs"`
	Status       string `json:"status"`
	PurchaseDate string `json:"purchase_date"`
}

func GetDevices(c *gin.Context) {
	// Obtener ID del contexto
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

	var devices []models.Device
	if err := db.DB.Where("user_id = ?", userID).Find(&devices).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al buscar los dispositivos: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, devices)
}

func CreateDevice(c *gin.Context) {
	// Obtener ID del contexto
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

	var input CreateDeviceInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos del equipo inválidos: " + err.Error()})
		return
	}

	// Validar unicidad del número de serie
	var existing models.Device
	cleanedSerial := strings.ToUpper(strings.TrimSpace(input.SerialNumber))
	if err := db.DB.Where("serial_number = ?", cleanedSerial).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Un dispositivo con este número de serie ya está registrado"})
		return
	}

	// Procesar fecha de compra
	var purchaseDate *time.Time
	if input.PurchaseDate != "" {
		// Intentar formatear YYYY-MM-DD
		t, err := time.Parse("2006-01-02", input.PurchaseDate)
		if err == nil {
			purchaseDate = &t
		} else {
			// Intentar formatear otros layouts comunes o por lo menos establecer la de hoy
			tNow := time.Now()
			purchaseDate = &tNow
		}
	} else {
		tNow := time.Now()
		purchaseDate = &tNow
	}

	// Clasificar tipo de dispositivo (Smartphone, Laptop, Tablet, Desktop, etc)
	deviceType := "Laptop" // Por defecto
	modelLower := strings.ToLower(input.Model)
	brandLower := strings.ToLower(input.Brand)

	if strings.Contains(modelLower, "phone") || strings.Contains(modelLower, "iphone") || strings.Contains(modelLower, "galaxy") || strings.Contains(modelLower, "pixel") || strings.Contains(brandLower, "apple") && strings.Contains(modelLower, "pro") && !strings.Contains(modelLower, "mac") {
		deviceType = "Smartphone"
	} else if strings.Contains(modelLower, "tablet") || strings.Contains(modelLower, "ipad") || strings.Contains(modelLower, "tab") {
		deviceType = "Tablet"
	} else if strings.Contains(modelLower, "desktop") || strings.Contains(modelLower, "imac") || strings.Contains(modelLower, "pc") || strings.Contains(modelLower, "torre") {
		deviceType = "Desktop"
	}

	status := input.Status
	if status == "" {
		status = "Active Warranty"
	}

	device := models.Device{
		UserID:       userID,
		Brand:        input.Brand,
		Model:        input.Model,
		SerialNumber: cleanedSerial,
		DeviceType:   deviceType,
		PurchaseDate: purchaseDate,
		Specs:        input.Specs,
		Status:       status,
	}

	if err := db.DB.Create(&device).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al registrar el dispositivo en la base de datos: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, device)
}
