package diagnostic

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/internal/db"
	"backend/internal/testutil"

	"github.com/gin-gonic/gin"
)

// buildDiagnosticRouter monta las mismas rutas que main.go registra para este
// módulo, para probar el flujo completo por HTTP.
func buildDiagnosticRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	h := NewDiagnosticHandlers(db.DB)
	d := r.Group("/api/diagnostic")
	{
		d.POST("/start", h.StartDiagnostic)
		d.POST("/answer", h.AnswerQuestion)
		d.GET("/:sessionId", h.GetSession)
		d.GET("/:sessionId/history", h.GetSessionHistory)
		d.GET("/:sessionId/products", h.GetRecommendedProducts)
	}
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

// TestDiagnosticFlow_SinAPIKeyUsaRespuestasDeterministas cubre el "modo
// simulado" documentado en el README (sin API_KEY_IA configurada): el motor
// de diagnóstico no llama a Groq y en su lugar sigue un guion fijo de 3
// preguntas antes de emitir un diagnóstico terminal. Es la única forma de
// probar este servicio sin mockear una API externa real.
func TestDiagnosticFlow_SinAPIKeyUsaRespuestasDeterministas(t *testing.T) {
	t.Setenv("API_KEY_IA", "")
	testutil.SetupTestDB(t)
	r := buildDiagnosticRouter()

	startResp := doRequest(r, "POST", "/api/diagnostic/start", map[string]any{
		"device_type":   "smartphone",
		"initial_issue": "No enciende",
	})
	if startResp.Code != http.StatusCreated {
		t.Fatalf("esperaba 201 al iniciar, obtuve %d: %s", startResp.Code, startResp.Body.String())
	}
	var start StartDiagnosticResponse
	if err := json.Unmarshal(startResp.Body.Bytes(), &start); err != nil {
		t.Fatalf("respuesta inválida: %v", err)
	}
	if start.TurnNumber != 1 || start.Question == "" {
		t.Fatalf("esperaba turn_number=1 y una pregunta no vacía, obtuve %+v", start)
	}

	var lastTurn DiagnosticTurnResponse
	answers := []string{"No enciende ninguna luz", "Ya probé otro cargador", "Se cayó ayer al piso"}
	for i, answer := range answers {
		resp := doRequest(r, "POST", "/api/diagnostic/answer", map[string]any{
			"session_id": start.SessionID,
			"answer":     answer,
		})
		if resp.Code != http.StatusOK {
			t.Fatalf("esperaba 200 en la respuesta %d, obtuve %d: %s", i+1, resp.Code, resp.Body.String())
		}
		if err := json.Unmarshal(resp.Body.Bytes(), &lastTurn); err != nil {
			t.Fatalf("respuesta inválida en el turno %d: %v", i+1, err)
		}
	}

	if !lastTurn.IsTerminal {
		t.Fatalf("esperaba diagnóstico terminal tras 3 respuestas, obtuve %+v", lastTurn)
	}
	if lastTurn.Diagnosis == "" {
		t.Fatalf("esperaba un diagnóstico no vacío")
	}
	if lastTurn.MinPrice <= 0 || lastTurn.MaxPrice < lastTurn.MinPrice {
		t.Fatalf("esperaba un rango de precios válido, obtuve min=%v max=%v", lastTurn.MinPrice, lastTurn.MaxPrice)
	}
	if len(lastTurn.Products) == 0 {
		t.Fatalf("esperaba al menos un producto recomendado")
	}

	sessionResp := doRequest(r, "GET", "/api/diagnostic/"+start.SessionID.String(), nil)
	if sessionResp.Code != http.StatusOK {
		t.Fatalf("esperaba 200 al consultar la sesión, obtuve %d: %s", sessionResp.Code, sessionResp.Body.String())
	}
	var session map[string]any
	if err := json.Unmarshal(sessionResp.Body.Bytes(), &session); err != nil {
		t.Fatalf("respuesta inválida: %v", err)
	}
	if session["status"] != "completed" || session["is_completed"] != true {
		t.Fatalf("esperaba la sesión marcada como completed/is_completed=true, obtuve %v", session)
	}

	historyResp := doRequest(r, "GET", "/api/diagnostic/"+start.SessionID.String()+"/history", nil)
	if historyResp.Code != http.StatusOK {
		t.Fatalf("esperaba 200 en el historial, obtuve %d: %s", historyResp.Code, historyResp.Body.String())
	}
	var history struct {
		Turns []map[string]any `json:"turns"`
	}
	if err := json.Unmarshal(historyResp.Body.Bytes(), &history); err != nil {
		t.Fatalf("respuesta inválida: %v", err)
	}
	if len(history.Turns) != 3 {
		t.Fatalf("esperaba 3 turnos en el historial, obtuve %d", len(history.Turns))
	}

	productsResp := doRequest(r, "GET", "/api/diagnostic/"+start.SessionID.String()+"/products", nil)
	if productsResp.Code != http.StatusOK {
		t.Fatalf("esperaba 200 en productos recomendados, obtuve %d: %s", productsResp.Code, productsResp.Body.String())
	}
}

// TestStartDiagnostic_LaptopUsaPreguntaEspecifica confirma que la rama sin IA
// distingue por device_type (laptop vs. el resto) en la primera pregunta.
func TestStartDiagnostic_LaptopUsaPreguntaEspecifica(t *testing.T) {
	t.Setenv("API_KEY_IA", "")
	testutil.SetupTestDB(t)
	r := buildDiagnosticRouter()

	resp := doRequest(r, "POST", "/api/diagnostic/start", map[string]any{
		"device_type":   "laptop",
		"initial_issue": "No enciende",
	})
	if resp.Code != http.StatusCreated {
		t.Fatalf("esperaba 201, obtuve %d: %s", resp.Code, resp.Body.String())
	}
	var start StartDiagnosticResponse
	if err := json.Unmarshal(resp.Body.Bytes(), &start); err != nil {
		t.Fatalf("respuesta inválida: %v", err)
	}
	if start.Question != "¿El dispositivo Dell o Apple enciende alguna luz LED o emite algún pitido al presionar el botón de encendido?" {
		t.Fatalf("pregunta inesperada para laptop: %q", start.Question)
	}
}
