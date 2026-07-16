package payment

import "testing"

// TestBuildPayerRequest_SinDocumentoNoEnviaIdentification documenta el caso
// legado (sin DNI) para no perder cobertura sobre el comportamiento previo.
func TestBuildPayerRequest_SinDocumentoNoEnviaIdentification(t *testing.T) {
	payer := buildPayerRequest("cliente@example.com", "", "")

	if payer.Email != "cliente@example.com" {
		t.Fatalf("esperaba email preservado, obtuve %q", payer.Email)
	}
	if payer.Identification != nil {
		t.Fatalf("esperaba Identification nil sin numero de documento, obtuve %+v", payer.Identification)
	}
}

// TestBuildPayerRequest_ConDocumentoIncluyeIdentification reproduce el bug
// detectado al probar pagos reales en el sandbox de Mercado Pago: sin enviar
// el documento del pagador, MP rechaza el pago con 403 "Payer email
// forbidden" (Perú lo exige) aunque la tarjeta y el token sean válidos.
func TestBuildPayerRequest_ConDocumentoIncluyeIdentification(t *testing.T) {
	payer := buildPayerRequest("cliente@example.com", "DNI", "12345678")

	if payer.Identification == nil {
		t.Fatal("esperaba Identification presente cuando se provee numero de documento")
	}
	if payer.Identification.Type != "DNI" || payer.Identification.Number != "12345678" {
		t.Fatalf("Identification incorrecta: %+v", payer.Identification)
	}
}

// TestBuildPayerRequest_TipoPorDefectoEsDNI cubre el fallback: el frontend
// puede no enviar el tipo de documento (solo el numero); en Peru el default
// razonable es DNI.
func TestBuildPayerRequest_TipoPorDefectoEsDNI(t *testing.T) {
	payer := buildPayerRequest("cliente@example.com", "", "12345678")

	if payer.Identification == nil || payer.Identification.Type != "DNI" {
		t.Fatalf("esperaba tipo de documento por defecto DNI, obtuve %+v", payer.Identification)
	}
}
