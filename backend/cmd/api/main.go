package main

import (
	"flag"
	"net/http"
	"os"

	"backend/internal/db"
	"backend/internal/handlers"
	"backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

func main() {
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
	r := gin.Default()
	r.Use(gin.Recovery())
	r.Use(middleware.CORSMiddleware())

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	api := r.Group("/api")
	{
		api.POST("/auth/register", handlers.Register)
		api.POST("/auth/login", handlers.Login)

		// Catálogo e-commerce
		api.GET("/products", handlers.GetProducts)
		api.GET("/products/:id", handlers.GetProductByID)

		// Pasarela de pago / Checkout
		api.POST("/checkout", handlers.ProcessCheckout)

		// Asistente de Diagnóstico (PIG)
		api.GET("/pig/start", handlers.StartDiagnostic)
		api.GET("/pig/node/:id", handlers.GetDiagnosticNode)
		api.POST("/pig/sessions", handlers.SaveDiagnosticSession)

		// Rutas protegidas por JWT
		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.GET("/auth/me", handlers.Me)
			protected.GET("/devices", handlers.GetDevices)
			protected.POST("/devices", handlers.CreateDevice)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
