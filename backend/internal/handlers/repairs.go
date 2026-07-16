package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"backend/internal/auth"
	"backend/internal/db"
	"backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// ConfirmRepairInput represents the confirmation of a repair diagnosis
type ConfirmRepairInput struct {
	PartType string `json:"part_type" binding:"required,oneof=original compatible economic"`
}

// UpdateRepairStatusInput represents status update
type UpdateRepairStatusInput struct {
	Status string `json:"status" binding:"required"`
	Notes  string `json:"notes"`
}

// ConfirmRepair - Client confirms diagnosis and moves to "agendado" state
func ConfirmRepair(c *gin.Context) {
	repairID := c.Param("id")
	var input ConfirmRepairInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get repair order
	var repair models.RepairOrder
	if err := db.DB.First(&repair, "id = ?", repairID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Repair not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// Validar que el usuario que consulta sea el dueño o un Admin/Tecnico
	requesterIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
		return
	}
	requesterRolVal, existsRol := c.Get("userRol")

	requesterID := requesterIDVal.(uuid.UUID)
	requesterRol := ""
	if existsRol {
		requesterRol = auth.NormalizeRole(requesterRolVal.(string))
	}

	if requesterID != repair.UserID && requesterRol != "admin" && requesterRol != "tecnico" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Acceso denegado: no puedes confirmar esta reparación"})
		return
	}

	// Only allow confirmation from "pending" state
	if repair.Status != "pending" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Repair is not in pending state"})
		return
	}

	// Update repair
	now := time.Now()
	repair.Status = "agendado"
	repair.PartType = input.PartType
	repair.AppointmentDatetime = now.AddDate(0, 0, 3) // Default 3 days from now

	if err := db.DB.Save(&repair).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Log status change
	tracking := models.RepairTracking{
		RepairID:       repair.ID,
		PreviousStatus: "pending",
		NewStatus:      "agendado",
		ChangedBy:      repair.UserID,
		Notes:          "Repair confirmed by client with " + input.PartType + " parts",
	}
	db.DB.Create(&tracking)

	c.JSON(http.StatusOK, repair)
}

// UpdateRepairStatus - Technician updates repair status
func UpdateRepairStatus(c *gin.Context) {
	repairID := c.Param("id")
	var input UpdateRepairStatusInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get repair order
	var repair models.RepairOrder
	if err := db.DB.First(&repair, "id = ?", repairID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Repair not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// Validar rol del usuario (solo admin o tecnico pueden actualizar estado)
	requesterIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
		return
	}
	requesterRolVal, existsRol := c.Get("userRol")
	requesterRol := ""
	if existsRol {
		requesterRol = auth.NormalizeRole(requesterRolVal.(string))
	}
	requesterID := requesterIDVal.(uuid.UUID)

	// Solo admin/tecnico o el propio usuario si cancela su propia reparación
	if requesterRol != "admin" && requesterRol != "tecnico" {
		if input.Status == "cancelada" && requesterID == repair.UserID {
			// Permitir cancelación por el cliente
		} else {
			c.JSON(http.StatusForbidden, gin.H{"error": "Acceso denegado: no tienes permiso para modificar el estado de esta reparación"})
			return
		}
	}

	// Validation: Only allow transition to "en_reparacion" if payment is approved
	if input.Status == "en_reparacion" {
		var payment models.Payment
		err := db.DB.Where("repair_id = ? AND status = ?", repair.ID, "approved").First(&payment).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot move to en_reparacion without approved payment"})
			return
		}
		if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	previousStatus := repair.Status
	repair.Status = input.Status

	// Auto-create warranty when transitioning to "reparado"
	if input.Status == "reparado" && previousStatus != "reparado" {
		warranty := models.Warranty{
			RepairID:      repair.ID,
			UserID:        repair.UserID,
			DeviceID:      repair.DeviceID,
			WarrantyDays:  30,
			StartDate:     time.Now(),
			EndDate:       time.Now().AddDate(0, 0, 30),
			IsActive:      true,
			WarrantyToken: "WARR-" + repair.ID.String() + "-" + uuid.New().String()[:8],
		}
		if err := db.DB.Create(&warranty).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create warranty: " + err.Error()})
			return
		}
	}

	if err := db.DB.Save(&repair).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Log status change
	tracking := models.RepairTracking{
		RepairID:       repair.ID,
		PreviousStatus: previousStatus,
		NewStatus:      input.Status,
		ChangedBy:      requesterID,
		Notes:          input.Notes,
	}
	db.DB.Create(&tracking)

	c.JSON(http.StatusOK, repair)
}

// GetRepairsByUser - Get all repairs for current user
func GetRepairsByUser(c *gin.Context) {
	userID := c.Param("userId")

	// Validar que el usuario que consulta sea el mismo o un Admin/Tecnico
	requesterIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
		return
	}
	requesterRolVal, existsRol := c.Get("userRol")

	requesterID := requesterIDVal.(uuid.UUID).String()
	requesterRol := ""
	if existsRol {
		requesterRol = auth.NormalizeRole(requesterRolVal.(string))
	}

	if requesterID != userID && requesterRol != "admin" && requesterRol != "tecnico" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Acceso denegado: no puedes ver las reparaciones de otro usuario"})
		return
	}

	var repairs []models.RepairOrder
	if err := db.DB.
		Where("user_id = ?", userID).
		Preload("Device").
		Preload("User").
		Preload("Payments").
		Order("created_at DESC").
		Find(&repairs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, repairs)
}

// GetRepairByID - Get single repair with related data
func GetRepairByID(c *gin.Context) {
	repairID := c.Param("id")

	var repair models.RepairOrder
	if err := db.DB.
		Preload("Device").
		Preload("User").
		Preload("Technician").
		Preload("Payments").
		First(&repair, "id = ?", repairID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Repair not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	// Validar que el usuario que consulta sea el dueño o un Admin/Tecnico
	requesterIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
		return
	}
	requesterRolVal, existsRol := c.Get("userRol")

	requesterID := requesterIDVal.(uuid.UUID)
	requesterRol := ""
	if existsRol {
		requesterRol = auth.NormalizeRole(requesterRolVal.(string))
	}

	if requesterID != repair.UserID && requesterRol != "admin" && requesterRol != "tecnico" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Acceso denegado: no tienes permiso para ver esta reparación"})
		return
	}

	c.JSON(http.StatusOK, repair)
}

// CreateRepairInput represents input payload for creating a repair order
type CreateRepairInput struct {
	DeviceID            string `json:"device_id" binding:"required"`
	PigSessionID        string `json:"pig_session_id"`
	AppointmentDatetime string `json:"appointment_datetime" binding:"required"`
	Notes               string `json:"notes"`
	Sucursal            string `json:"sucursal"`
	FailurePhoto        string `json:"failure_photo"`
}

// CreateRepair schedules a new repair order for the authenticated user
func CreateRepair(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
		return
	}
	userID := userIDVal.(uuid.UUID)

	var input CreateRepairInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	deviceUUID, err := uuid.Parse(input.DeviceID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de dispositivo inválido"})
		return
	}

	// Verificar que el dispositivo pertenezca al usuario
	var device models.Device
	if err := db.DB.Where("id = ? AND user_id = ?", deviceUUID, userID).First(&device).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Dispositivo no encontrado o no pertenece a tu usuario"})
		return
	}

	appointmentTime, err := time.Parse(time.RFC3339, input.AppointmentDatetime)
	if err != nil {
		// Intentar parsing alternativo YYYY-MM-DD HH:MM
		appointmentTime, err = time.Parse("2006-01-02 15:04:05", input.AppointmentDatetime)
		if err != nil {
			appointmentTime, err = time.Parse("2006-01-02T15:04:05", input.AppointmentDatetime)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Formato de fecha inválido. Use RFC3339 o YYYY-MM-DD HH:MM:SS"})
				return
			}
		}
	}

	repair := models.RepairOrder{
		UserID:              userID,
		DeviceID:            deviceUUID,
		AppointmentDatetime: appointmentTime,
		Status:              "pending",
		Notes:               input.Notes,
		Sucursal:            input.Sucursal,
		FailurePhoto:        input.FailurePhoto,
	}

	// Si hay sesión PIG, cargar estimaciones y diagnóstico preliminar
	if input.PigSessionID != "" {
		pigUUID, err := uuid.Parse(input.PigSessionID)
		if err == nil {
			var session models.PigSession
			if err := db.DB.First(&session, "id = ?", pigUUID).Error; err == nil {
				repair.PigSessionID = &pigUUID
				repair.DiagnosisFinal = session.PreliminaryDiagnosis
				repair.EstimatedPriceMin = session.EstimatedPriceMin
				repair.EstimatedPriceMax = session.EstimatedPriceMax
				
				// Marcar la sesión PIG como convertida a orden
				session.ConvertedToOrder = true
				db.DB.Save(&session)
			}
		}
	}

	// Asignar un técnico disponible automáticamente si existe
	var tech models.Usuario
	if err := db.DB.Where("rol = ?", "Tecnico").First(&tech).Error; err == nil {
		repair.TechnicianID = &tech.ID
	}

	// Guardar en la base de datos
	if err := db.DB.Create(&repair).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al registrar la orden de reparación: " + err.Error()})
		return
	}

	// Crear el primer registro de tracking
	tracking := models.RepairTracking{
		RepairID:       repair.ID,
		PreviousStatus: "",
		NewStatus:      "pending",
		ChangedBy:      userID,
		Notes:          "Orden de reparación creada y asignada en estado pendiente.",
	}
	db.DB.Create(&tracking)

	c.JSON(http.StatusCreated, repair)
}

// GetAllRepairs - Get all repair orders for admin/technician
// GET /api/repairs
func GetAllRepairs(c *gin.Context) {
	// Extraer datos del JWT adjunto por AuthMiddleware
	userRolVal, existsRol := c.Get("userRol")
	userIDVal, existsUser := c.Get("userID")

	var repairs []models.RepairOrder
	query := db.DB.Preload("Device").Preload("User").Preload("Technician").Order("created_at DESC")

	if existsRol && existsUser {
		role := auth.NormalizeRole(userRolVal.(string))
		if role == "tecnico" {
			// Los técnicos solo visualizan sus propios trabajos asignados
			userID := userIDVal.(uuid.UUID)
			query = query.Where("technician_id = ?", userID)
		}
	}

	if err := query.Find(&repairs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, repairs)
}

type AssignTechnicianInput struct {
	TechnicianID string `json:"technician_id" binding:"required"`
}

// AssignTechnician assigns a technician to a repair order (Admin only)
func AssignTechnician(c *gin.Context) {
	// Verificar si el solicitante es administrador
	userRolVal, exists := c.Get("userRol")
	if !exists || auth.NormalizeRole(userRolVal.(string)) != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Acceso denegado: se requieren permisos de administrador"})
		c.Abort()
		return
	}

	repairIDStr := c.Param("id")
	repairID, err := uuid.Parse(repairIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de reparación inválido"})
		return
	}

	var input AssignTechnicianInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	techID, err := uuid.Parse(input.TechnicianID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de técnico inválido"})
		return
	}

	// Verificar si el técnico existe y realmente tiene el rol de técnico o admin
	var tecnico models.Usuario
	if err := db.DB.First(&tecnico, "id = ?", techID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Técnico no encontrado"})
		return
	}
	if auth.NormalizeRole(tecnico.Rol) != "tecnico" && auth.NormalizeRole(tecnico.Rol) != "admin" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "El usuario seleccionado no tiene el rol de Técnico"})
		return
	}

	// Buscar la reparación
	var repair models.RepairOrder
	if err := db.DB.First(&repair, "id = ?", repairID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Orden de reparación no encontrada"})
		return
	}

	repair.TechnicianID = &techID
	if err := db.DB.Save(&repair).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al asignar el técnico"})
		return
	}

	// Cargar relaciones para responder con el objeto completo
	db.DB.Preload("User").Preload("Device").Preload("Technician").First(&repair, "id = ?", repair.ID)

	c.JSON(http.StatusOK, gin.H{"message": "Técnico asignado con éxito", "repair": repair})
}

type AddPartToRepairInput struct {
	ProductID string `json:"product_id" binding:"required"`
	Cantidad  int    `json:"cantidad" binding:"required,gt=0"`
}

// AddPartToRepair associates a product/part with a repair order, deducting inventory stock
func AddPartToRepair(c *gin.Context) {
	repairIDStr := c.Param("id")
	repairID, err := uuid.Parse(repairIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de reparación inválido"})
		return
	}

	var input AddPartToRepairInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	productID, err := uuid.Parse(input.ProductID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de producto/repuesto inválido"})
		return
	}

	// Iniciar transacción de base de datos
	tx := db.DB.Begin()

	// 1. Verificar que la orden de reparación exista
	var repair models.RepairOrder
	if err := tx.First(&repair, "id = ?", repairID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "Orden de reparación no encontrada"})
		return
	}

	// 2. Verificar que el producto exista y tenga stock
	var product models.Producto
	if err := tx.First(&product, "id = ?", productID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "Repuesto no encontrado en el catálogo"})
		return
	}

	if product.StockActual < input.Cantidad {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "Stock insuficiente para vincular este repuesto"})
		return
	}

	// 3. Descontar del inventario
	product.StockActual -= input.Cantidad
	if err := tx.Save(&product).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar stock del repuesto"})
		return
	}

	// 4. Registrar la vinculación
	subtotal := product.PrecioVenta * float64(input.Cantidad)
	link := models.RepairOrderProducto{
		ID:             uuid.New(),
		RepairID:       repairID,
		ProductoID:     productID,
		Cantidad:       input.Cantidad,
		PrecioUnitario: product.PrecioVenta,
		Subtotal:       subtotal,
		CreatedAt:      time.Now(),
	}

	if err := tx.Create(&link).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al registrar vinculación del repuesto"})
		return
	}

	// 5. Sumar costo al precio final de la orden de reparación
	repair.FinalPrice += subtotal
	if err := tx.Save(&repair).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar el precio final de la reparación"})
		return
	}

	tx.Commit()

	c.JSON(http.StatusOK, gin.H{
		"message": "Repuesto vinculado correctamente",
		"part":    link,
	})
}

// GetUserWarranties returns all warranties for the authenticated user
func GetUserWarranties(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
		return
	}
	userID := userIDVal.(uuid.UUID)

	var warranties []models.Warranty
	if err := db.DB.
		Where("user_id = ?", userID).
		Preload("Device").
		Preload("RepairOrder").
		Find(&warranties).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, warranties)
}

// ClaimWarrantyInput represents payload for claiming a warranty
type ClaimWarrantyInput struct {
	WarrantyID string `json:"warranty_id" binding:"required"`
	Notes      string `json:"notes" binding:"required"`
}

// ClaimWarranty handles the submission of a warranty claim
func ClaimWarranty(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
		return
	}
	userID := userIDVal.(uuid.UUID)

	var input ClaimWarrantyInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	warrantyUUID, err := uuid.Parse(input.WarrantyID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de garantía inválido"})
		return
	}

	var warranty models.Warranty
	if err := db.DB.
		Preload("RepairOrder").
		Preload("RepairOrder.Device").
		Where("id = ?", warrantyUUID).
		First(&warranty).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Garantía no encontrada"})
		return
	}

	if warranty.RepairOrder.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Esta garantía no pertenece a tu usuario"})
		return
	}

	if !warranty.IsActive {
		c.JSON(http.StatusBadRequest, gin.H{"error": "La garantía no está activa"})
		return
	}

	if time.Now().After(warranty.EndDate) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "La garantía ha expirado"})
		return
	}

	claimRepair := models.RepairOrder{
		UserID:              userID,
		DeviceID:            warranty.RepairOrder.DeviceID,
		AppointmentDatetime: time.Now().Add(24 * time.Hour),
		Status:              "pending",
		PartType:            warranty.RepairOrder.PartType,
		EstimatedPriceMin:   0,
		EstimatedPriceMax:   0,
		FinalPrice:          0,
		Notes:               fmt.Sprintf("[RECLAMACIÓN DE GARANTÍA - Token: %s]\nOriginal Ticket: %s\nFalla descrita: %s", warranty.WarrantyToken, warranty.RepairID.String(), input.Notes),
	}

	if err := db.DB.Create(&claimRepair).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al registrar la reclamación: " + err.Error()})
		return
	}

	tracking := models.RepairTracking{
		RepairID:       claimRepair.ID,
		PreviousStatus: "",
		NewStatus:      "pending",
		ChangedBy:      userID,
		Notes:          "Orden creada por reclamación de garantía del ticket " + warranty.RepairID.String(),
	}
	db.DB.Create(&tracking)

	c.JSON(http.StatusOK, gin.H{
		"message":      "Reclamación de garantía registrada exitosamente. Se ha generado una nueva orden de revisión sin costo.",
		"repair_order": claimRepair,
	})
}
