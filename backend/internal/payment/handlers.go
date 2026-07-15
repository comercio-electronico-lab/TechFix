package payment

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"backend/internal/db"
	"backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/mercadopago/sdk-go/pkg/payment"
	"gorm.io/gorm"
)

func CreatePayment(c *gin.Context) {
	var req CreatePaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "usuario no autenticado"})
		return
	}

	userUUID := userID.(uuid.UUID)

	var repairID *uuid.UUID
	if req.RepairID != nil {
		parsed, err := uuid.Parse(*req.RepairID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "repair_id inválido"})
			return
		}
		repairID = &parsed
	}

	installments := req.Installments
	if installments == 0 {
		installments = 1
	}

	// Token es obligatorio (debe generarse en frontend)
	if req.Token == "" && os.Getenv("TESTING_MODE") != "true" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "token de tarjeta requerido"})
		return
	}

	var mpPayment *payment.Response
	var err error
	var mercadoPagoID string

	// En modo testing, crear un pago simulado sin llamar a MP
	if os.Getenv("TESTING_MODE") == "true" {
		mercadoPagoID = fmt.Sprintf("TEST-%d", time.Now().Unix())
	} else {
		// Modo producción: crear pago en Mercado Pago
		mpPayment, err = CreateMercadoPagoPayment(req.Amount, req.PayerEmail, req.Description, installments, req.Token, req.PaymentMethodID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("error creando pago en Mercado Pago: %v", err)})
			return
		}
		mercadoPagoID = fmt.Sprintf("%d", mpPayment.ID)
	}

	status := "pending"
	if os.Getenv("TESTING_MODE") == "true" {
		status = "approved"
	}

	paymentRecord := models.Payment{
		UserID:         userUUID,
		RepairID:       repairID,
		Amount:         req.Amount,
		Currency:       "PEN",
		Description:    req.Description,
		Status:         status,
		PayerEmail:     req.PayerEmail,
		PaymentDetails: "{}",
		MercadoPagoID:  mercadoPagoID,
	}

	// Usar transacción para garantizar consistencia
	err = db.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&paymentRecord).Error; err != nil {
			return err
		}

		// Si el pago es aprobado inmediatamente (ej: TESTING_MODE=true) y tiene vinculada una reparación
		if paymentRecord.Status == "approved" && paymentRecord.RepairID != nil {
			// Actualizar estado de la reparación a "agendado" y fijar cita por defecto (3 días)
			err := tx.Model(&models.RepairOrder{}).
				Where("id = ?", *paymentRecord.RepairID).
				Updates(map[string]interface{}{
					"status":               "agendado",
					"appointment_datetime": time.Now().AddDate(0, 0, 3),
				}).Error
			if err != nil {
				return err
			}

			// Registrar en tracking
			err = tx.Create(&models.RepairTracking{
				RepairID:       *paymentRecord.RepairID,
				PreviousStatus: "pending",
				NewStatus:      "agendado",
				ChangedBy:      paymentRecord.UserID,
				Notes:          "Pago de cita aprobado e inicio agendado",
			}).Error
			if err != nil {
				return err
			}
		}

		return nil
	})
	if err != nil {
		// Si falla el INSERT pero el pago fue creado en MP, loguear el ID para recuperación
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":             fmt.Sprintf("error al crear pago: %v", err),
			"mercado_pago_id":   mercadoPagoID,
		})
		return
	}

	response := PaymentResponse{
		ID:             paymentRecord.ID.String(),
		Amount:         paymentRecord.Amount,
		Status:         paymentRecord.Status,
		MercadoPagoID:  paymentRecord.MercadoPagoID,
		Description:    paymentRecord.Description,
		CreatedAt:      paymentRecord.CreatedAt.Format("2006-01-02 15:04:05"),
		TransactionURL: fmt.Sprintf("/api/payments/%s/checkout", paymentRecord.ID.String()),
	}

	c.JSON(http.StatusCreated, response)
}

func GetPayment(c *gin.Context) {
	paymentID := c.Param("id")

	var paymentRecord models.Payment
	if err := db.DB.First(&paymentRecord, "id = ?", paymentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "pago no encontrado"})
		return
	}

	response := PaymentResponse{
		ID:            paymentRecord.ID.String(),
		Amount:        paymentRecord.Amount,
		Status:        paymentRecord.Status,
		MercadoPagoID: paymentRecord.MercadoPagoID,
		PaymentMethod: paymentRecord.PaymentMethod,
		Description:   paymentRecord.Description,
		CreatedAt:     paymentRecord.CreatedAt.Format("2006-01-02 15:04:05"),
	}

	c.JSON(http.StatusOK, response)
}

func GetPayments(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "usuario no autenticado"})
		return
	}

	userUUID := userID.(uuid.UUID)

	var payments []models.Payment
	if err := db.DB.Where("user_id = ?", userUUID).Order("created_at DESC").Find(&payments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error al obtener pagos"})
		return
	}

	var responses []PaymentResponse
	for _, p := range payments {
		responses = append(responses, PaymentResponse{
			ID:            p.ID.String(),
			Amount:        p.Amount,
			Status:        p.Status,
			MercadoPagoID: p.MercadoPagoID,
			PaymentMethod: p.PaymentMethod,
			Description:   p.Description,
			CreatedAt:     p.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	c.JSON(http.StatusOK, responses)
}

func CheckPaymentStatus(c *gin.Context) {
	paymentID := c.Param("id")

	var paymentRecord models.Payment
	if err := db.DB.First(&paymentRecord, "id = ?", paymentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "pago no encontrado"})
		return
	}

	// Consultar status actual en Mercado Pago
	status, err := GetPaymentStatus(paymentRecord.MercadoPagoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("error consultando status: %v", err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":                paymentRecord.ID.String(),
		"mercado_pago_id":   paymentRecord.MercadoPagoID,
		"status":            status,
		"amount":            paymentRecord.Amount,
		"description":       paymentRecord.Description,
		"created_at":        paymentRecord.CreatedAt.Format("2006-01-02 15:04:05"),
	})
}

func RefundPayment(c *gin.Context) {
	paymentID := c.Param("id")

	var paymentRecord models.Payment
	if err := db.DB.First(&paymentRecord, "id = ?", paymentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "pago no encontrado"})
		return
	}

	// Reembolsar en Mercado Pago
	err := RefundMercadoPagoPayment(paymentRecord.MercadoPagoID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("error reembolsando pago: %v", err)})
		return
	}

	// Actualizar status en BD a "refunded"
	db.DB.Model(&models.Payment{}).Where("id = ?", paymentID).Update("status", "refunded")

	c.JSON(http.StatusOK, gin.H{
		"id":     paymentRecord.ID.String(),
		"status": "refunded",
		"amount": paymentRecord.Amount,
	})
}
