package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/internal/testutil"

	"github.com/gin-gonic/gin"
)

func setupAuthRouter(t *testing.T) *gin.Engine {
	testutil.SetupTestDB(t)
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.POST("/api/auth/register", Register)
	r.POST("/api/auth/login", Login)
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

func TestRegister_Success(t *testing.T) {
	r := setupAuthRouter(t)

	w := doRequest(r, "POST", "/api/auth/register", map[string]any{
		"nombre":   "Carlos Ruiz",
		"email":    "carlos@example.com",
		"login":    "carlosr",
		"password": "secreto123",
	})

	if w.Code != http.StatusCreated {
		t.Fatalf("esperaba 201, obtuve %d: %s", w.Code, w.Body.String())
	}
}

func TestRegister_DuplicateEmail(t *testing.T) {
	r := setupAuthRouter(t)

	payload := map[string]any{
		"nombre":   "Carlos Ruiz",
		"email":    "carlos@example.com",
		"login":    "carlosr",
		"password": "secreto123",
	}

	w1 := doRequest(r, "POST", "/api/auth/register", payload)
	if w1.Code != http.StatusCreated {
		t.Fatalf("el primer registro debía funcionar, obtuve %d: %s", w1.Code, w1.Body.String())
	}

	w2 := doRequest(r, "POST", "/api/auth/register", payload)
	if w2.Code != http.StatusConflict {
		t.Fatalf("esperaba 409 por email duplicado, obtuve %d: %s", w2.Code, w2.Body.String())
	}
}

func TestLogin_Success(t *testing.T) {
	r := setupAuthRouter(t)

	doRequest(r, "POST", "/api/auth/register", map[string]any{
		"nombre":   "Carlos Ruiz",
		"email":    "carlos@example.com",
		"login":    "carlosr",
		"password": "secreto123",
	})

	w := doRequest(r, "POST", "/api/auth/login", map[string]any{
		"email":    "carlos@example.com",
		"password": "secreto123",
	})

	if w.Code != http.StatusOK {
		t.Fatalf("esperaba 200, obtuve %d: %s", w.Code, w.Body.String())
	}

	var resp map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("respuesta inválida: %v", err)
	}
	if resp["token"] == nil || resp["token"] == "" {
		t.Fatalf("esperaba un token JWT en la respuesta, obtuve: %v", resp)
	}
}

func TestLogin_WrongPassword(t *testing.T) {
	r := setupAuthRouter(t)

	doRequest(r, "POST", "/api/auth/register", map[string]any{
		"nombre":   "Carlos Ruiz",
		"email":    "carlos@example.com",
		"login":    "carlosr",
		"password": "secreto123",
	})

	w := doRequest(r, "POST", "/api/auth/login", map[string]any{
		"email":    "carlos@example.com",
		"password": "contraseña-incorrecta",
	})

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("esperaba 401 por contraseña incorrecta, obtuve %d: %s", w.Code, w.Body.String())
	}
}
