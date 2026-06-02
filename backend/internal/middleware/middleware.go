package middleware

import (
	"net/http"
	"strings"

	"backend/internal/utils"
	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Cabecera de autorización requerida"})
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if !(len(parts) == 2 && parts[0] == "Bearer") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Formato de autorización debe ser Bearer <token>"})
			c.Abort()
			return
		}

		claims, err := utils.ValidateToken(parts[1])
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido o expirado: " + err.Error()})
			c.Abort()
			return
		}

		// Establecer información de usuario en el contexto
		c.Set("userID", claims.UserID)
		c.Set("userEmail", claims.Email)
		c.Set("userRol", claims.Rol)

		c.Next()
	}
}

func RoleMiddleware(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleVal, exists := c.Get("userRol")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Rol no verificado en sesión"})
			c.Abort()
			return
		}

		role, ok := roleVal.(string)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interno al verificar privilegios"})
			c.Abort()
			return
		}

		// Validar si el rol del token coincide con alguno permitido
		isAllowed := false
		for _, r := range allowedRoles {
			if strings.EqualFold(role, r) {
				isAllowed = true
				break
			}
		}

		if !isAllowed {
			c.JSON(http.StatusForbidden, gin.H{"error": "Acceso denegado. No posees los privilegios administrativos requeridos."})
			c.Abort()
			return
		}

		c.Next()
	}
}
