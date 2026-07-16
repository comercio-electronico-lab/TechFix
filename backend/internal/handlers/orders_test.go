package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"testing"

	"backend/internal/db"
	"backend/internal/models"
	"backend/internal/testutil"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// fakeAuth simula lo que AuthMiddleware dejaría en el contexto, sin depender de JWT real.
func fakeAuth(userID uuid.UUID) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("userID", userID)
		c.Next()
	}
}

func buildOrdersRouter(userID uuid.UUID) *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	orders := r.Group("/api/orders")
	orders.Use(fakeAuth(userID))
	{
		orders.POST("", CreateOrder)
		orders.GET("/me", GetUserOrders)
		orders.GET("/:id", GetOrderByID)
	}
	return r
}

func seedUsuario(t *testing.T) models.Usuario {
	t.Helper()
	usuario := models.Usuario{
		Nombre: "Cliente Test",
		Email:  fmt.Sprintf("cliente-%s@example.com", uuid.NewString()),
		Login:  "clientetest",
	}
	if err := db.DB.Create(&usuario).Error; err != nil {
		t.Fatalf("no se pudo crear usuario de prueba: %v", err)
	}
	return usuario
}

func seedProducto(t *testing.T, stock int, precio float64) models.Producto {
	t.Helper()
	producto := models.Producto{
		Nombre:      "Batería Dell XPS 13",
		SKU:         fmt.Sprintf("SKU-%s", uuid.NewString()),
		PrecioVenta: precio,
		StockActual: stock,
	}
	if err := db.DB.Create(&producto).Error; err != nil {
		t.Fatalf("no se pudo crear producto de prueba: %v", err)
	}
	return producto
}

func seedPayment(t *testing.T, userID uuid.UUID, amount float64) models.Payment {
	t.Helper()
	payment := models.Payment{
		UserID:        userID,
		Amount:        amount,
		Status:        "approved",
		MercadoPagoID: fmt.Sprintf("TEST-%s", uuid.NewString()),
	}
	if err := db.DB.Create(&payment).Error; err != nil {
		t.Fatalf("no se pudo crear payment de prueba: %v", err)
	}
	return payment
}

func TestCreateOrder_DescuentaStockYPersisteItems(t *testing.T) {
	testutil.SetupTestDB(t)
	usuario := seedUsuario(t)
	r := buildOrdersRouter(usuario.ID)

	producto := seedProducto(t, 10, 250.0)
	payment := seedPayment(t, usuario.ID, 500.0)

	w := doRequest(r, "POST", "/api/orders", map[string]any{
		"payment_id": payment.ID.String(),
		"items": []map[string]any{
			{"producto_id": producto.ID.String(), "cantidad": 2},
		},
		"nombre_envio":    "Carlos Ruiz",
		"direccion_envio": "Av. Perú 123, Ayacucho",
		"envio":           10.0,
		"impuestos":       90.0,
	})

	if w.Code != http.StatusCreated {
		t.Fatalf("esperaba 201, obtuve %d: %s", w.Code, w.Body.String())
	}

	var pedidoActualizado models.Producto
	if err := db.DB.First(&pedidoActualizado, "id = ?", producto.ID).Error; err != nil {
		t.Fatalf("no se pudo releer el producto: %v", err)
	}
	if pedidoActualizado.StockActual != 8 {
		t.Fatalf("esperaba stock=8 tras descontar 2 unidades, obtuve %d", pedidoActualizado.StockActual)
	}

	var resp map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("respuesta inválida: %v", err)
	}
	if resp["subtotal"].(float64) != 500.0 {
		t.Fatalf("esperaba subtotal=500, obtuve %v", resp["subtotal"])
	}
	if resp["total"].(float64) != 600.0 {
		t.Fatalf("esperaba total=600 (500 subtotal + 10 envio + 90 impuestos), obtuve %v", resp["total"])
	}
}

// TestCreateOrder_ReintentoConMismoPaymentIdNoDuplica simula un reintento del
// frontend (respuesta perdida por corte de red, doble clic, etc.) reenviando
// la misma petición con el mismo payment_id: debe devolver el pedido ya
// creado en vez de duplicarlo y descontar el stock una segunda vez.
func TestCreateOrder_ReintentoConMismoPaymentIdNoDuplica(t *testing.T) {
	testutil.SetupTestDB(t)
	usuario := seedUsuario(t)
	r := buildOrdersRouter(usuario.ID)

	producto := seedProducto(t, 10, 250.0)
	payment := seedPayment(t, usuario.ID, 500.0)

	body := map[string]any{
		"payment_id": payment.ID.String(),
		"items": []map[string]any{
			{"producto_id": producto.ID.String(), "cantidad": 2},
		},
	}

	first := doRequest(r, "POST", "/api/orders", body)
	if first.Code != http.StatusCreated {
		t.Fatalf("esperaba 201 en la primera petición, obtuve %d: %s", first.Code, first.Body.String())
	}
	var firstPedido map[string]any
	if err := json.Unmarshal(first.Body.Bytes(), &firstPedido); err != nil {
		t.Fatalf("respuesta inválida: %v", err)
	}

	retry := doRequest(r, "POST", "/api/orders", body)
	if retry.Code != http.StatusOK {
		t.Fatalf("esperaba 200 en el reintento (pedido ya existente), obtuve %d: %s", retry.Code, retry.Body.String())
	}
	var retryPedido map[string]any
	if err := json.Unmarshal(retry.Body.Bytes(), &retryPedido); err != nil {
		t.Fatalf("respuesta inválida: %v", err)
	}
	if retryPedido["id"] != firstPedido["id"] {
		t.Fatalf("el reintento debía devolver el mismo pedido (%v), obtuve %v", firstPedido["id"], retryPedido["id"])
	}

	var pedidosCount int64
	db.DB.Model(&models.Pedido{}).Where("payment_id = ?", payment.ID).Count(&pedidosCount)
	if pedidosCount != 1 {
		t.Fatalf("esperaba exactamente 1 pedido para el payment_id, obtuve %d", pedidosCount)
	}

	var productoFinal models.Producto
	if err := db.DB.First(&productoFinal, "id = ?", producto.ID).Error; err != nil {
		t.Fatalf("no se pudo releer el producto: %v", err)
	}
	if productoFinal.StockActual != 8 {
		t.Fatalf("esperaba stock=8 (descontado una sola vez), obtuve %d", productoFinal.StockActual)
	}
}

// TestCreateOrder_ReintentoConcurrenteNoDuplica es la versión concurrente del
// caso anterior: dos peticiones con el mismo payment_id corriendo a la vez
// (ninguna alcanza a ver el pre-check de la otra). La restricción unique en
// payment_id debe frenar el duplicado en el INSERT, y el handler debe
// recuperarse devolviendo el pedido ganador en vez de un 500.
func TestCreateOrder_ReintentoConcurrenteNoDuplica(t *testing.T) {
	testutil.SetupTestDB(t)
	usuario := seedUsuario(t)
	r := buildOrdersRouter(usuario.ID)

	producto := seedProducto(t, 10, 250.0)
	payment := seedPayment(t, usuario.ID, 500.0)

	body := map[string]any{
		"payment_id": payment.ID.String(),
		"items": []map[string]any{
			{"producto_id": producto.ID.String(), "cantidad": 2},
		},
	}

	var wg sync.WaitGroup
	codes := make([]int, 2)
	for i := 0; i < 2; i++ {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()
			w := doRequest(r, "POST", "/api/orders", body)
			codes[idx] = w.Code
		}(i)
	}
	wg.Wait()

	for _, code := range codes {
		if code != http.StatusCreated && code != http.StatusOK {
			t.Fatalf("código de respuesta inesperado: %d", code)
		}
	}

	var pedidosCount int64
	db.DB.Model(&models.Pedido{}).Where("payment_id = ?", payment.ID).Count(&pedidosCount)
	if pedidosCount != 1 {
		t.Fatalf("esperaba exactamente 1 pedido tras la carrera, obtuve %d", pedidosCount)
	}

	var productoFinal models.Producto
	if err := db.DB.First(&productoFinal, "id = ?", producto.ID).Error; err != nil {
		t.Fatalf("no se pudo releer el producto: %v", err)
	}
	if productoFinal.StockActual != 8 {
		t.Fatalf("esperaba stock=8 (descontado una sola vez pese a la carrera), obtuve %d", productoFinal.StockActual)
	}
}

func TestCreateOrder_StockInsuficienteNoDescuenta(t *testing.T) {
	testutil.SetupTestDB(t)
	usuario := seedUsuario(t)
	r := buildOrdersRouter(usuario.ID)

	producto := seedProducto(t, 1, 250.0)
	payment := seedPayment(t, usuario.ID, 500.0)

	w := doRequest(r, "POST", "/api/orders", map[string]any{
		"payment_id": payment.ID.String(),
		"items": []map[string]any{
			{"producto_id": producto.ID.String(), "cantidad": 5},
		},
	})

	if w.Code != http.StatusBadRequest {
		t.Fatalf("esperaba 400 por stock insuficiente, obtuve %d: %s", w.Code, w.Body.String())
	}

	var productoSinCambios models.Producto
	if err := db.DB.First(&productoSinCambios, "id = ?", producto.ID).Error; err != nil {
		t.Fatalf("no se pudo releer el producto: %v", err)
	}
	if productoSinCambios.StockActual != 1 {
		t.Fatalf("el stock no debía cambiar tras un pedido rechazado, obtuve %d", productoSinCambios.StockActual)
	}
}

// TestCreateOrder_ConcurrenciaNoSobrevendeStock reproduce dos compras simultáneas
// por la última unidad disponible: solo una debe tener éxito y el stock jamás
// debe quedar negativo (regresión de la condición de carrera en el descuento de stock).
func TestCreateOrder_ConcurrenciaNoSobrevendeStock(t *testing.T) {
	testutil.SetupTestDB(t)
	usuario := seedUsuario(t)
	r := buildOrdersRouter(usuario.ID)

	producto := seedProducto(t, 1, 250.0)
	paymentA := seedPayment(t, usuario.ID, 250.0)
	paymentB := seedPayment(t, usuario.ID, 250.0)

	var wg sync.WaitGroup
	codes := make([]int, 2)
	payments := []models.Payment{paymentA, paymentB}

	for i := 0; i < 2; i++ {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()
			w := doRequest(r, "POST", "/api/orders", map[string]any{
				"payment_id": payments[idx].ID.String(),
				"items": []map[string]any{
					{"producto_id": producto.ID.String(), "cantidad": 1},
				},
			})
			codes[idx] = w.Code
		}(i)
	}
	wg.Wait()

	successCount := 0
	for _, code := range codes {
		if code == http.StatusCreated {
			successCount++
		} else if code != http.StatusBadRequest {
			t.Fatalf("código de respuesta inesperado: %d", code)
		}
	}
	if successCount != 1 {
		t.Fatalf("esperaba exactamente 1 pedido exitoso de 2 concurrentes, obtuve %d", successCount)
	}

	var productoFinal models.Producto
	if err := db.DB.First(&productoFinal, "id = ?", producto.ID).Error; err != nil {
		t.Fatalf("no se pudo releer el producto: %v", err)
	}
	if productoFinal.StockActual != 0 {
		t.Fatalf("esperaba stock=0 tras la carrera, obtuve %d (posible oversell)", productoFinal.StockActual)
	}
}

func TestGetUserOrders_SoloDevuelvePedidosDelUsuario(t *testing.T) {
	testutil.SetupTestDB(t)
	usuario := seedUsuario(t)
	otroUsuario := seedUsuario(t)
	r := buildOrdersRouter(usuario.ID)

	producto := seedProducto(t, 10, 100.0)
	payment := seedPayment(t, usuario.ID, 100.0)

	doRequest(r, "POST", "/api/orders", map[string]any{
		"payment_id": payment.ID.String(),
		"items": []map[string]any{
			{"producto_id": producto.ID.String(), "cantidad": 1},
		},
	})

	// Pedido de otro usuario, no debería aparecer en la consulta de "usuario".
	otroPayment := seedPayment(t, otroUsuario.ID, 100.0)
	otroPedido := models.Pedido{UsuarioID: otroUsuario.ID, PaymentID: &otroPayment.ID, Subtotal: 100}
	if err := db.DB.Create(&otroPedido).Error; err != nil {
		t.Fatalf("no se pudo crear pedido de otro usuario: %v", err)
	}

	w := doRequest(r, "GET", "/api/orders/me", nil)
	if w.Code != http.StatusOK {
		t.Fatalf("esperaba 200, obtuve %d: %s", w.Code, w.Body.String())
	}

	var pedidos []models.Pedido
	if err := json.Unmarshal(w.Body.Bytes(), &pedidos); err != nil {
		t.Fatalf("respuesta inválida: %v", err)
	}
	if len(pedidos) != 1 {
		t.Fatalf("esperaba 1 pedido para el usuario autenticado, obtuve %d", len(pedidos))
	}
	if pedidos[0].UsuarioID != usuario.ID {
		t.Fatalf("el pedido devuelto no pertenece al usuario autenticado")
	}
}
