package handlers

import (
	"errors"
	"net/http"
	"time"

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
		ChangedBy:      uuid.New(), // Should be current user from JWT
		Notes:          input.Notes,
	}
	db.DB.Create(&tracking)

	c.JSON(http.StatusOK, repair)
}

// GetRepairsByUser - Get all repairs for current user
func GetRepairsByUser(c *gin.Context) {
	userID := c.Param("userId")

	var repairs []models.RepairOrder
	if err := db.DB.
		Where("user_id = ?", userID).
		Preload("Device").
		Preload("User").
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
		First(&repair, "id = ?", repairID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Repair not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, repair)
}
