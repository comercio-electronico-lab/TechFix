package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"
	"time"

	"backend/internal/auth"
	"backend/internal/db"
	"backend/internal/diagnostic"
	"backend/internal/handlers"
	"backend/internal/payment"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Cargar variables de entorno desde el archivo .env si existe
	_ = godotenv.Load()

	seedFlag := flag.Bool("seed", false, "Insertar datos iniciales")
	migrateFlag := flag.Bool("migrate", false, "Ejecutar migraciones")
	migrateDownFlag := flag.Bool("migrate-down", false, "Revertir migraciones")
	flag.Parse()

	// Siempre conectar
	db.Connect()

	// Si es migración down, revertir y salir
	if *migrateDownFlag {
		db.MigrateDown()
		return
	}

	// Si es migración, migrar y salir
	if *migrateFlag {
		db.Migrate()
		return
	}

	// Si es seed, insertar datos y salir
	if *seedFlag {
		db.Seed()
		return
	}

	// Si no hay flags, correr el servidor normal
	startServer()
}

func startServer() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Desactivar output de Gin
	gin.SetMode(gin.ReleaseMode)

	// Mostrar banner de bienvenida primero
	printBanner(port)

	// Crear router con logger personalizado
	r := gin.New()
	// Confiar en TODOS los proxies para obtener IP real
	r.SetTrustedProxies(nil)
	r.Use(customLogger())
	r.Use(gin.Recovery())

	// Middleware de CORS para permitir solicitudes del Frontend en Next.js
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Ruta de estado de salud
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// Debug: mostrar headers y IP
	r.GET("/debug/headers", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"client_ip":          c.ClientIP(),
			"remote_addr":        c.Request.RemoteAddr,
			"x-forwarded-for":    c.GetHeader("X-Forwarded-For"),
			"x-real-ip":          c.GetHeader("X-Real-IP"),
			"x-client-ip":        c.GetHeader("X-Client-IP"),
			"trusted_proxies":    "nil (confía en todos)",
		})
	})

	// Grupo de rutas de la API
	api := r.Group("/api")
	{
		// Rutas del sistema de presupuesto interactivo (PIG)
		pig := api.Group("/pig")
		{
			pig.GET("/nodes", handlers.GetPigNodes)
		}

		// Rutas de Diagnóstico por IA (públicas, sin autenticación)
		diagnosticHandlers := diagnostic.NewDiagnosticHandlers(db.DB)
		{
			api.POST("/diagnostic/start", diagnosticHandlers.StartDiagnostic)
			api.POST("/diagnostic/answer", diagnosticHandlers.AnswerQuestion)
			api.GET("/diagnostic/:sessionId", diagnosticHandlers.GetSession)
			api.GET("/diagnostic/:sessionId/history", diagnosticHandlers.GetSessionHistory)
			api.GET("/diagnostic/:sessionId/products", diagnosticHandlers.GetRecommendedProducts)
		}

		// Rutas de Catálogo de Dispositivos (públicas, sin autenticación)
		{
			api.GET("/catalog/devices", handlers.GetDeviceCatalog)
			api.GET("/catalog/devices/:deviceType", handlers.GetDevicesByType)
			api.GET("/catalog/devices/:deviceType/brands", handlers.GetDeviceBrands)
			api.GET("/catalog/devices/:deviceType/brands/:brand/models", handlers.GetDeviceModels)
		}

		// Rutas de Productos (públicas, optimizadas para búsqueda)
		productsHandlers := handlers.NewProductsHandler(db.DB)
		{
			api.GET("/products/search", productsHandlers.SearchProducts)
			api.GET("/products/categories", productsHandlers.GetCategories)
			api.GET("/products/category/:categoryName", productsHandlers.GetProductsByCategory)
			api.GET("/products/:productId", productsHandlers.GetProductByID)
			
			// Modificación de productos protegida para Administrador
			api.POST("/products", auth.AuthMiddleware(), auth.RoleMiddleware("Admin"), productsHandlers.CreateProduct)
			api.PUT("/products/:productId", auth.AuthMiddleware(), auth.RoleMiddleware("Admin"), productsHandlers.UpdateProduct)
			api.DELETE("/products/:productId", auth.AuthMiddleware(), auth.RoleMiddleware("Admin"), productsHandlers.DeleteProduct)
		}

		// Rutas de Proveedores (protegidas para Administrador)
		suppliersHandlers := handlers.NewSuppliersHandler(db.DB)
		{
			api.GET("/suppliers", auth.AuthMiddleware(), auth.RoleMiddleware("Admin"), suppliersHandlers.GetSuppliers)
			api.POST("/suppliers", auth.AuthMiddleware(), auth.RoleMiddleware("Admin"), suppliersHandlers.CreateSupplier)
			api.PUT("/suppliers/:id", auth.AuthMiddleware(), auth.RoleMiddleware("Admin"), suppliersHandlers.UpdateSupplier)
			api.DELETE("/suppliers/:id", auth.AuthMiddleware(), auth.RoleMiddleware("Admin"), suppliersHandlers.DeleteSupplier)
			api.POST("/suppliers/orders", auth.AuthMiddleware(), auth.RoleMiddleware("Admin"), suppliersHandlers.CreateRestockOrder)
		}

		// Rutas públicas de Autenticación
		authRoutes := api.Group("/auth")
		{
			authRoutes.POST("/register", auth.Register)
			authRoutes.POST("/login", auth.Login)
		}

		// Rutas privadas del Usuario (protegidas por AuthMiddleware)
		user := api.Group("/user")
		user.Use(auth.AuthMiddleware())
		{
			user.GET("/profile", handlers.GetProfile)
			user.PUT("/profile", handlers.UpdateProfile)
			user.GET("/all", auth.RoleMiddleware("Admin"), handlers.GetAllUsers)
			user.GET("/all-devices", auth.RoleMiddleware("Admin", "Tecnico"), handlers.GetAllDevices)
			user.PUT("/:id/role", auth.RoleMiddleware("Admin"), handlers.UpdateUserRole)
			user.PUT("/:id/status", auth.RoleMiddleware("Admin"), handlers.UpdateUserStatus)
			user.DELETE("/:id", auth.RoleMiddleware("Admin"), handlers.DeleteUser)

			// CRUD de Equipos del usuario
			user.GET("/devices", handlers.GetDevices)
			user.POST("/devices", handlers.CreateDevice)
			user.PUT("/devices/:id", handlers.UpdateDevice)
			user.DELETE("/devices/:id", handlers.DeleteDevice)
		}

		// Rutas de Reparaciones (protegidas por AuthMiddleware)
		repairs := api.Group("/repairs")
		repairs.Use(auth.AuthMiddleware())
		{
			repairs.GET("", auth.RoleMiddleware("Admin", "Tecnico"), handlers.GetAllRepairs)
			repairs.GET("/user/:userId", handlers.GetRepairsByUser)
			repairs.GET("/:id", handlers.GetRepairByID)
			repairs.POST("/:id/confirm", handlers.ConfirmRepair)
			repairs.PATCH("/:id/status", handlers.UpdateRepairStatus)
			repairs.PUT("/:id/assign", handlers.AssignTechnician)
			repairs.POST("/:id/parts", handlers.AddPartToRepair)
			repairs.POST("", handlers.CreateRepair)
		}

		// Rutas de Pagos (protegidas por AuthMiddleware)
		payments := api.Group("/payments")
		payments.Use(auth.AuthMiddleware())
		{
			payments.POST("", payment.CreatePayment)
			payments.GET("/:id", payment.GetPayment)
			payments.GET("/:id/status", payment.CheckPaymentStatus)
			payments.POST("/:id/refund", payment.RefundPayment)
			payments.GET("", payment.GetPayments)
		}

		// Información pública de Mercado Pago para el frontend (sin autenticación)
		api.GET("/payments/info", payment.GetTestToken)

		// Webhook de Mercado Pago (sin autenticación)
		api.POST("/webhooks/mercado-pago", payment.ProcessPaymentWebhook)
	}

	r.Run(":" + port)
}

func customLogger() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		statusColor := getStatusColor(param.StatusCode)
		methodColor := getMethodColor(param.Method)
		// El ClientIP en param ya contiene la IP correcta del middleware
		clientIP := param.ClientIP

		return fmt.Sprintf("[%s] %s %s%s%s %s %s → %d %s\n",
			param.TimeStamp.Format("15:04:05"),
			methodColor+param.Method+"\033[0m",
			statusColor,
			param.Path,
			"\033[0m",
			clientIP,
			param.Latency,
			param.StatusCode,
			param.ErrorMessage,
		)
	})
}

func getStatusColor(code int) string {
	switch {
	case code >= 200 && code < 300:
		return "\033[32m" // Green
	case code >= 300 && code < 400:
		return "\033[36m" // Cyan
	case code >= 400 && code < 500:
		return "\033[33m" // Yellow
	default:
		return "\033[31m" // Red
	}
}

func getMethodColor(method string) string {
	switch method {
	case "GET":
		return "\033[34m" // Blue
	case "POST":
		return "\033[32m" // Green
	case "PUT":
		return "\033[33m" // Yellow
	case "DELETE":
		return "\033[31m" // Red
	default:
		return "\033[35m" // Magenta
	}
}

func printBanner(port string) {
	banner := fmt.Sprintf(`
   _____ _____ _   _
  / ____|_   _| \ | |
 | |  __  | | |  \| |
 | | |_ | | | | . \ |
 | |__| |_| |_| |\  |
  \_____|_____|_| \_|

┌─────────────────────────────────────────────────────────┐
│                                                         │
│           ✨ TECHFIX API SERVER RUNNING ✨            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📊 Database ............ ✓ Connected                  │
│  🚀 Server Port ......... %s                           │
│  🔧 Environment ......... %s                    │
│  🕐 Started ............. %s          │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  ✅ Ready to handle requests! 💪                       │
│  🔥 Hot reload enabled - watching for changes...       │
│                                                         │
└─────────────────────────────────────────────────────────┘

`, port, padRight(os.Getenv("GIN_MODE"), 17), time.Now().Format("2006-01-02 15:04:05"))

	fmt.Print(banner)
}

func padRight(s string, length int) string {
	if len(s) >= length {
		return s
	}
	return s + " " + fmt.Sprintf("%*s", length-len(s)-1, "")
}
