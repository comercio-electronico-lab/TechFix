package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Falta cabecera de autorización"})
			c.Abort()
			return
		}

		const bearerPrefix = "Bearer "
		if len(authHeader) <= len(bearerPrefix) || authHeader[:len(bearerPrefix)] != bearerPrefix {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Formato de autorización inválido"})
			c.Abort()
			return
		}

		tokenString := authHeader[len(bearerPrefix):]
		claims, err := ParseToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Sesión inválida o expirada"})
			c.Abort()
			return
		}

		c.Set("userID", claims.UserID)
		c.Set("userEmail", claims.Email)
		c.Set("userRol", claims.Rol)

		c.Next()
	}
}

// RoleMiddleware checks if the user has one of the allowed roles
func RoleMiddleware(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRolVal, exists := c.Get("userRol")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No autorizado: rol no encontrado"})
			c.Abort()
			return
		}

		userRol := userRolVal.(string)
		isAllowed := false
		for _, role := range allowedRoles {
			if NormalizeRole(userRol) == NormalizeRole(role) {
				isAllowed = true
				break
			}
		}

		if !isAllowed {
			c.JSON(http.StatusForbidden, gin.H{"error": "Acceso denegado: permisos insuficientes"})
			c.Abort()
			return
		}

		c.Next()
	}
}

func NormalizeRole(role string) string {
	switch role {
	case "Admin", "admin", "ADMIN":
		return "admin"
	case "Tecnico", "tecnico", "TECNICO", "Técnico", "técnico", "TÉCNICO":
		return "tecnico"
	case "Cliente", "cliente", "CLIENTE":
		return "cliente"
	default:
		return role
	}
}
