package payment

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// GetTestToken devuelve información para testing
func GetTestToken(c *gin.Context) {
	publicKey := os.Getenv("MERCADO_PAGO_PUBLIC_KEY")

	response := gin.H{
		"message": "Para obtener un token real, usa la SDK de Mercado Pago en el frontend",
		"public_key": publicKey,
		"test_card": gin.H{
			"number": "4009175332806176",
			"cvv": "123",
			"expiry": "11/30",
		},
	}

	c.JSON(http.StatusOK, response)
}
