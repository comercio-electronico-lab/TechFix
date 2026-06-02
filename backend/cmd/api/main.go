package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"
	"time"

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
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Configurar modo de Gin basado en ambiente
	env := os.Getenv("GIN_MODE")
	if env == "" {
		gin.SetMode(gin.DebugMode)
	}

	// Crear router con logger personalizado
	r := gin.New()
	r.Use(customLogger())
	r.Use(gin.Recovery())

	// Mostrar banner de bienvenida
	printBanner(port)

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
		// Rutas del sistema de presupuesto interactivo (PIG)
		pig := api.Group("/pig")
		{
			pig.GET("/nodes", handlers.GetPigNodes)
		}

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

	r.Run(":" + port)
}

func customLogger() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		statusColor := getStatusColor(param.StatusCode)
		methodColor := getMethodColor(param.Method)

		return fmt.Sprintf("[%s] %s %s%s%s %s %s → %d %s\n",
			param.TimeStamp.Format("15:04:05"),
			methodColor+param.Method+"\033[0m",
			statusColor,
			param.Path,
			"\033[0m",
			param.ClientIP,
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
