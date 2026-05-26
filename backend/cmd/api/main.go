package main

import (
	"net/http"
	"os"

	"backend/internal/db"
	"github.com/gin-gonic/gin"
)

func main() {
	// Inicializar DB
	db.Connect()

	r := gin.Default()

	// Middleware de recuperación ante panics
	r.Use(gin.Recovery())

	// Ruta de salud
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
			"db":     "connected",
		})
	})

	// Aquí irán las rutas directas
	// r.GET("/usuarios", handlers.GetUsuarios)
	// r.POST("/reparaciones", handlers.CreateReparacion)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r.Run(":" + port)
}
