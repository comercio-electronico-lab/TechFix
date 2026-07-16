package payment

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/internal/db"
	"backend/internal/models"
	"backend/internal/testutil"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func buildPaymentsRouter(userID uuid.UUID) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	payments := r.Group("/api/payments")
	payments.Use(func(c *gin.Context) {
		c.Set("userID", userID)
		c.Next()
	})
	payments.POST("", CreatePayment)
	return r
}

func doRequest(r *gin.Engine, method, path string, body any) *httptest.ResponseRecorder {
	var buf bytes.Buffer
	if body != nil {
		json.NewEncoder(&buf).Encode(body)
	}
	req := httptest.NewRequest(method, path, &buf)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func seedUsuario(t *testing.T) models.Usuario {
	t.Helper()
	usuario := models.Usuario{
		Nombre: "Cliente Test",
		Email:  "cliente-" + uuid.NewString() + "@example.com",
		Login:  "clientetest-" + uuid.NewString(),
	}
	if err := db.DB.Create(&usuario).Error; err != nil {
		t.Fatalf("no se pudo crear usuario de prueba: %v", err)
	}
	return usuario
}

// TestCreatePayment_TestingModeQuedaAprobadoDeInmediato fija el contrato del
// modo de pruebas: sin llamar a Mercado Pago, el pago debe quedar "approved"
// de inmediato (comportamiento usado por defecto en dev/CI).
func TestCreatePayment_TestingModeQuedaAprobadoDeInmediato(t *testing.T) {
	t.Setenv("TESTING_MODE", "true")
	testutil.SetupTestDB(t)
	usuario := seedUsuario(t)
	r := buildPaymentsRouter(usuario.ID)

	w := doRequest(r, "POST", "/api/payments", map[string]any{
		"amount":      100.0,
		"description": "Compra de prueba",
		"payer_email": usuario.Email,
	})

	if w.Code != http.StatusCreated {
		t.Fatalf("esperaba 201, obtuve %d: %s", w.Code, w.Body.String())
	}

	var resp map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("respuesta inválida: %v", err)
	}
	if resp["status"] != "approved" {
		t.Fatalf("esperaba status=approved en modo testing, obtuve %v", resp["status"])
	}

	var paymentRecord models.Payment
	if err := db.DB.First(&paymentRecord, "id = ?", resp["id"]).Error; err != nil {
		t.Fatalf("no se pudo releer el pago: %v", err)
	}
	if paymentRecord.Status != "approved" {
		t.Fatalf("esperaba Payment.Status=approved persistido en BD, obtuve %q", paymentRecord.Status)
	}
}

// TestCreatePayment_SinTokenNiTestingModeFalla documenta que fuera del modo de
// pruebas el token de tarjeta es obligatorio (lo genera el Brick de Mercado
// Pago en el frontend); sin él, ni siquiera se intenta contactar a MP.
func TestCreatePayment_SinTokenNiTestingModeFalla(t *testing.T) {
	testutil.SetupTestDB(t)
	usuario := seedUsuario(t)
	r := buildPaymentsRouter(usuario.ID)

	w := doRequest(r, "POST", "/api/payments", map[string]any{
		"amount":      100.0,
		"description": "Compra de prueba",
		"payer_email": usuario.Email,
	})

	if w.Code != http.StatusBadRequest {
		t.Fatalf("esperaba 400 por falta de token, obtuve %d: %s", w.Code, w.Body.String())
	}
}
