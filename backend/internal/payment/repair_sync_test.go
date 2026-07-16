package payment

import (
	"testing"

	"backend/internal/db"
	"backend/internal/models"
	"backend/internal/testutil"

	"github.com/google/uuid"
)

func seedRepairOrder(t *testing.T, status string) models.RepairOrder {
	t.Helper()

	usuario := models.Usuario{
		Nombre: "Cliente Test",
		Email:  "cliente-" + uuid.NewString() + "@example.com",
		Login:  "clientetest-" + uuid.NewString(),
	}
	if err := db.DB.Create(&usuario).Error; err != nil {
		t.Fatalf("no se pudo crear usuario de prueba: %v", err)
	}

	device := models.Device{
		UserID:       usuario.ID,
		Brand:        "Dell",
		Model:        "XPS 13",
		SerialNumber: "SN-" + uuid.NewString(),
		DeviceType:   "laptop",
	}
	if err := db.DB.Create(&device).Error; err != nil {
		t.Fatalf("no se pudo crear dispositivo de prueba: %v", err)
	}

	repair := models.RepairOrder{
		UserID:   usuario.ID,
		DeviceID: device.ID,
		Status:   status,
	}
	if err := db.DB.Create(&repair).Error; err != nil {
		t.Fatalf("no se pudo crear reparación de prueba: %v", err)
	}
	return repair
}

// TestSyncApprovedRepairPayment_SegundaLlamadaEsNoOp reproduce un webhook
// duplicado (o CreatePayment + webhook llegando para el mismo pago): la
// primera llamada debe transicionar pending -> agendado y registrar tracking;
// la segunda, sobre la misma reparación ya agendada, no debe hacer nada.
func TestSyncApprovedRepairPayment_SegundaLlamadaEsNoOp(t *testing.T) {
	testutil.SetupTestDB(t)
	repair := seedRepairOrder(t, "pending")
	actor := repair.UserID

	changed, err := SyncApprovedRepairPayment(db.DB, repair.ID, actor, "primera aprobación")
	if err != nil {
		t.Fatalf("error inesperado en la primera llamada: %v", err)
	}
	if !changed {
		t.Fatalf("esperaba que la primera llamada hiciera la transición")
	}

	var afterFirst models.RepairOrder
	if err := db.DB.First(&afterFirst, "id = ?", repair.ID).Error; err != nil {
		t.Fatalf("no se pudo releer la reparación: %v", err)
	}
	if afterFirst.Status != "agendado" {
		t.Fatalf("esperaba status=agendado tras la primera llamada, obtuve %q", afterFirst.Status)
	}
	firstAppointment := afterFirst.AppointmentDatetime

	changed, err = SyncApprovedRepairPayment(db.DB, repair.ID, actor, "webhook duplicado")
	if err != nil {
		t.Fatalf("error inesperado en la segunda llamada: %v", err)
	}
	if changed {
		t.Fatalf("la segunda llamada no debía reportar cambio (debe ser no-op)")
	}

	var afterSecond models.RepairOrder
	if err := db.DB.First(&afterSecond, "id = ?", repair.ID).Error; err != nil {
		t.Fatalf("no se pudo releer la reparación: %v", err)
	}
	if !afterSecond.AppointmentDatetime.Equal(firstAppointment) {
		t.Fatalf("la fecha de cita no debía recalcularse en la segunda llamada")
	}

	var trackingCount int64
	db.DB.Model(&models.RepairTracking{}).Where("repair_id = ?", repair.ID).Count(&trackingCount)
	if trackingCount != 1 {
		t.Fatalf("esperaba exactamente 1 registro de tracking, obtuve %d", trackingCount)
	}
}

// TestSyncApprovedRepairPayment_NoRetrocedeEstadoAvanzado es el escenario que
// motivó el fix: un webhook de Mercado Pago tardío llega después de que el
// técnico ya movió la reparación a "en_reparacion". Sin la guarda de
// idempotencia, esto la regresaba a "agendado" violando la máquina de
// estados (los estados solo avanzan, nunca retroceden).
func TestSyncApprovedRepairPayment_NoRetrocedeEstadoAvanzado(t *testing.T) {
	testutil.SetupTestDB(t)
	repair := seedRepairOrder(t, "en_reparacion")

	changed, err := SyncApprovedRepairPayment(db.DB, repair.ID, repair.UserID, "webhook tardío")
	if err != nil {
		t.Fatalf("error inesperado: %v", err)
	}
	if changed {
		t.Fatalf("no debía reportar cambio: la reparación ya no está en pending")
	}

	var afterCall models.RepairOrder
	if err := db.DB.First(&afterCall, "id = ?", repair.ID).Error; err != nil {
		t.Fatalf("no se pudo releer la reparación: %v", err)
	}
	if afterCall.Status != "en_reparacion" {
		t.Fatalf("esperaba que el estado se mantuviera en en_reparacion, obtuve %q", afterCall.Status)
	}

	var trackingCount int64
	db.DB.Model(&models.RepairTracking{}).Where("repair_id = ?", repair.ID).Count(&trackingCount)
	if trackingCount != 0 {
		t.Fatalf("no debía crearse ningún registro de tracking, obtuve %d", trackingCount)
	}
}
