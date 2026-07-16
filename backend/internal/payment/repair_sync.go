package payment

import (
	"time"

	"backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// SyncApprovedRepairPayment transiciona una reparación de "pending" a "agendado"
// cuando su pago fue aprobado, y registra el cambio en el tracking.
//
// Es idempotente a propósito: tanto CreatePayment (aprobación síncrona) como
// ProcessPaymentWebhook (aprobación asíncrona) pueden intentar esta misma
// transición para el mismo repair_id -- por un doble pago, un reintento de
// Mercado Pago, o un webhook que llega tarde. Al condicionar el UPDATE a
// status="pending" y solo registrar tracking si el UPDATE realmente afectó
// una fila, una segunda llamada se vuelve un no-op: no duplica el tracking
// ni retrocede una reparación que el técnico ya avanzó (en_reparacion,
// reparado, etc.) de vuelta a "agendado".
//
// Devuelve true si esta llamada fue la que hizo la transición.
func SyncApprovedRepairPayment(tx *gorm.DB, repairID, changedBy uuid.UUID, notes string) (bool, error) {
	result := tx.Model(&models.RepairOrder{}).
		Where("id = ? AND status = ?", repairID, "pending").
		Updates(map[string]interface{}{
			"status":               "agendado",
			"appointment_datetime": time.Now().AddDate(0, 0, 3),
		})
	if result.Error != nil {
		return false, result.Error
	}
	if result.RowsAffected == 0 {
		return false, nil
	}

	if err := tx.Create(&models.RepairTracking{
		RepairID:       repairID,
		PreviousStatus: "pending",
		NewStatus:      "agendado",
		ChangedBy:      changedBy,
		Notes:          notes,
	}).Error; err != nil {
		return false, err
	}

	return true, nil
}
