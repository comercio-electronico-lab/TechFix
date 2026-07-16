package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/internal/db"
	"backend/internal/models"
	"backend/internal/testutil"

	"github.com/gin-gonic/gin"
)

func buildSuppliersRouter() (*gin.Engine, *SuppliersHandler) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	h := NewSuppliersHandler(db.DB)
	orders := r.Group("/api/suppliers/orders")
	{
		orders.POST("", h.CreateRestockOrder)
		orders.GET("", h.GetRestockOrders)
		orders.PUT("/:id/receive", h.ReceiveRestockOrder)
	}
	return r, h
}

func seedProveedor(t *testing.T) models.Proveedor {
	t.Helper()
	proveedor := models.Proveedor{Nombre: "Proveedor Test"}
	if err := db.DB.Create(&proveedor).Error; err != nil {
		t.Fatalf("no se pudo crear proveedor de prueba: %v", err)
	}
	return proveedor
}

func doJSONRequest(r *gin.Engine, method, path string, body any) *httptest.ResponseRecorder {
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

// TestReceiveRestockOrder_IncrementaStock reproduce el gap detectado: antes de
// este endpoint, una orden de reabastecimiento se creaba y quedaba parada en
// "solicitado" para siempre porque nada incrementaba stock_actual cuando la
// mercadería llegaba.
func TestReceiveRestockOrder_IncrementaStock(t *testing.T) {
	testutil.SetupTestDB(t)
	r, _ := buildSuppliersRouter()

	proveedor := seedProveedor(t)
	producto := seedProducto(t, 3, 89.99)

	w := doJSONRequest(r, "POST", "/api/suppliers/orders", map[string]any{
		"proveedor_id": proveedor.ID.String(),
		"producto_id":  producto.ID.String(),
		"cantidad":     20,
	})
	if w.Code != http.StatusCreated {
		t.Fatalf("esperaba 201 creando la orden, obtuve %d: %s", w.Code, w.Body.String())
	}
	var created models.PedidoRepuesto
	if err := json.Unmarshal(w.Body.Bytes(), &created); err != nil {
		t.Fatalf("respuesta inválida: %v", err)
	}
	if created.Estado != "solicitado" {
		t.Fatalf("esperaba estado inicial 'solicitado', obtuve %q", created.Estado)
	}

	w = doJSONRequest(r, "PUT", fmt.Sprintf("/api/suppliers/orders/%s/receive", created.ID), nil)
	if w.Code != http.StatusOK {
		t.Fatalf("esperaba 200 al recibir la orden, obtuve %d: %s", w.Code, w.Body.String())
	}

	var reloaded models.Producto
	if err := db.DB.First(&reloaded, "id = ?", producto.ID).Error; err != nil {
		t.Fatalf("no se pudo releer el producto: %v", err)
	}
	if reloaded.StockActual != 23 {
		t.Fatalf("esperaba stock_actual=23 (3+20) tras recibir la orden, obtuve %d", reloaded.StockActual)
	}

	var reloadedOrder models.PedidoRepuesto
	if err := db.DB.First(&reloadedOrder, "id = ?", created.ID).Error; err != nil {
		t.Fatalf("no se pudo releer la orden: %v", err)
	}
	if reloadedOrder.Estado != "recibido" {
		t.Fatalf("esperaba estado 'recibido' tras recibir la orden, obtuve %q", reloadedOrder.Estado)
	}
}

// TestReceiveRestockOrder_NoDuplicaAlRecibirDosVeces evita que un doble clic
// (o un reintento de red) incremente el stock dos veces por la misma orden.
func TestReceiveRestockOrder_NoDuplicaAlRecibirDosVeces(t *testing.T) {
	testutil.SetupTestDB(t)
	r, _ := buildSuppliersRouter()

	proveedor := seedProveedor(t)
	producto := seedProducto(t, 0, 89.99)

	w := doJSONRequest(r, "POST", "/api/suppliers/orders", map[string]any{
		"proveedor_id": proveedor.ID.String(),
		"producto_id":  producto.ID.String(),
		"cantidad":     10,
	})
	var created models.PedidoRepuesto
	json.Unmarshal(w.Body.Bytes(), &created)

	w = doJSONRequest(r, "PUT", fmt.Sprintf("/api/suppliers/orders/%s/receive", created.ID), nil)
	if w.Code != http.StatusOK {
		t.Fatalf("esperaba 200 en la primera recepción, obtuve %d: %s", w.Code, w.Body.String())
	}

	w = doJSONRequest(r, "PUT", fmt.Sprintf("/api/suppliers/orders/%s/receive", created.ID), nil)
	if w.Code != http.StatusBadRequest {
		t.Fatalf("esperaba 400 al reintentar recibir una orden ya recibida, obtuve %d: %s", w.Code, w.Body.String())
	}

	var reloaded models.Producto
	db.DB.First(&reloaded, "id = ?", producto.ID)
	if reloaded.StockActual != 10 {
		t.Fatalf("esperaba stock_actual=10 (sin duplicar), obtuve %d", reloaded.StockActual)
	}
}

// TestGetRestockOrders_DevuelveOrdenesConRelaciones cubre el listado que
// faltaba: sin él, el panel de admin no tenía forma de ver qué órdenes
// seguían pendientes de recibir.
func TestGetRestockOrders_DevuelveOrdenesConRelaciones(t *testing.T) {
	testutil.SetupTestDB(t)
	r, _ := buildSuppliersRouter()

	proveedor := seedProveedor(t)
	producto := seedProducto(t, 5, 89.99)

	doJSONRequest(r, "POST", "/api/suppliers/orders", map[string]any{
		"proveedor_id": proveedor.ID.String(),
		"producto_id":  producto.ID.String(),
		"cantidad":     15,
	})

	w := doJSONRequest(r, "GET", "/api/suppliers/orders", nil)
	if w.Code != http.StatusOK {
		t.Fatalf("esperaba 200, obtuve %d: %s", w.Code, w.Body.String())
	}

	var orders []models.PedidoRepuesto
	if err := json.Unmarshal(w.Body.Bytes(), &orders); err != nil {
		t.Fatalf("respuesta inválida: %v", err)
	}
	if len(orders) != 1 {
		t.Fatalf("esperaba 1 orden, obtuve %d", len(orders))
	}
	if orders[0].Producto.ID != producto.ID {
		t.Fatalf("esperaba producto precargado en la orden, obtuve %+v", orders[0].Producto)
	}
}
