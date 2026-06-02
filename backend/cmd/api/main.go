package main

import (
	"flag"
	"net/http"
	"os"

	"backend/internal/db"
	"backend/internal/handlers"
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
	r := gin.Default()
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

	// Grupo de rutas de la API
	api := r.Group("/api")
	{
		// Rutas públicas de Autenticación
		auth := api.Group("/auth")
		{
			auth.POST("/register", handlers.Register)
			auth.POST("/login", handlers.Login)
		}

		// Rutas privadas del Usuario (protegidas por AuthMiddleware)
		user := api.Group("/user")
		user.Use(handlers.AuthMiddleware())
		{
			user.GET("/profile", handlers.GetProfile)
			user.PUT("/profile", handlers.UpdateProfile)

			// CRUD de Equipos del usuario
			user.GET("/devices", handlers.GetDevices)
			user.POST("/devices", handlers.CreateDevice)
			user.PUT("/devices/:id", handlers.UpdateDevice)
			user.DELETE("/devices/:id", handlers.DeleteDevice)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
