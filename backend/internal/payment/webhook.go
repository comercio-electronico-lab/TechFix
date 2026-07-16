package payment

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"os"
	"strings"

	"backend/internal/db"
	"backend/internal/models"
	"github.com/gin-gonic/gin"
)

func VerifyMercadoPagoSignature(c *gin.Context) bool {
	// Obtener headers de Mercado Pago
	xSignature := c.GetHeader("x-signature")
	xRequestId := c.GetHeader("x-request-id")

	// Obtener parámetros de la URL
	queryParams := c.Request.URL.Query()
	dataID := queryParams.Get("data.id")

	// Separar x-signature en partes
	parts := strings.Split(xSignature, ",")

	var ts, hash string
	for _, part := range parts {
		keyValue := strings.SplitN(part, "=", 2)
		if len(keyValue) == 2 {
			key := strings.TrimSpace(keyValue[0])
			value := strings.TrimSpace(keyValue[1])
			if key == "ts" {
				ts = value
			} else if key == "v1" {
				hash = value
			}
		}
	}

	// Obtener secret key de variables de entorno
	secret := os.Getenv("MERCADO_PAGO_WEBHOOK_SECRET")
	if secret == "" {
		return false
	}

	// Generar el manifest string
	manifest := fmt.Sprintf("id:%s;request-id:%s;ts:%s;", dataID, xRequestId, ts)

	// Crear HMAC con SHA256
	hm := hmac.New(sha256.New, []byte(secret))
	hm.Write([]byte(manifest))

	// Obtener el hash como string hexadecimal
	sha := hex.EncodeToString(hm.Sum(nil))

	return sha == hash
}

func ProcessPaymentWebhook(c *gin.Context) {
	if !VerifyMercadoPagoSignature(c) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Firma HMAC inválida"})
		return
	}

	var webhookData struct {
		Action  string `json:"action"`
		Data    struct {
			ID string `json:"id"`
		} `json:"data"`
	}

	if err := c.ShouldBindJSON(&webhookData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if webhookData.Action == "payment.created" || webhookData.Action == "payment.updated" {
		// Consultar el pago en Mercado Pago para obtener el status real
		resource, err := GetMercadoPagoPayment(webhookData.Data.ID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error consultando pago en Mercado Pago"})
			return
		}

		// Actualizar pago en BD con el status real (approved, rejected, pending, etc.)
		updates := map[string]interface{}{
			"status": resource.Status,
		}

		// Guardar también el método de pago si está disponible
		if resource.PaymentMethodID != "" {
			updates["payment_method"] = resource.PaymentMethodID
		}

		var paymentRecord models.Payment
		if err := db.DB.Where("mercado_pago_id = ?", webhookData.Data.ID).First(&paymentRecord).Error; err == nil {
			db.DB.Model(&paymentRecord).Updates(updates)

			// Si el pago fue aprobado y está vinculado a una reparación, actualizar la reparación.
			// Mercado Pago puede reenviar el mismo evento (reintentos por timeout) y este webhook
			// puede llegar después de que el pago ya se aprobó de forma síncrona en CreatePayment;
			// SyncApprovedRepairPayment es idempotente y evita retroceder una reparación que el
			// técnico ya avanzó (en_reparacion, reparado, etc.) a "agendado" por un evento
			// duplicado o tardío.
			if resource.Status == "approved" && paymentRecord.RepairID != nil {
				SyncApprovedRepairPayment(db.DB, *paymentRecord.RepairID, paymentRecord.UserID, "Pago de cita aprobado vía webhook de Mercado Pago")
			}
		} else {
			// Si el pago no existe aún en la base de datos local (ej. webhook llegó antes de la respuesta del frontend)
			// lo creamos o esperamos, pero por consistencia intentamos crear un registro básico o ignorar si no hay repair_id.
			// Aquí asumimos que ya existe porque el frontend crea el pago local antes de redirigir o esperar.
		}
	}

	c.JSON(http.StatusOK, gin.H{"status": "processed"})
}
