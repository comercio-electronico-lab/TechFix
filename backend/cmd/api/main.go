package main

import (
	"flag"
	"net/http"
	"os"

	"backend/internal/db"
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

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
