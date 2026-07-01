package handlers

import (
	"net/http"
	"os"
	"time"

	"backend/internal/auth"
	"backend/internal/db"
	"backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte(getJWTSecret())

func getJWTSecret() string {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		return "techfix-super-secret-key-2026-designed-by-gemini"
	}
	return secret
}

// Claims represent JWT claims
type Claims struct {
	UserID uuid.UUID `json:"user_id"`
	Email  string    `json:"email"`
	Rol    string    `json:"rol"`
	jwt.RegisteredClaims
}

// RegisterInput represents register payload
type RegisterInput struct {
	Nombre   string `json:"nombre" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Login    string `json:"login" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
}

// LoginInput represents login payload
type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// UpdateProfileInput represents profile update payload
type UpdateProfileInput struct {
	Nombre string `json:"nombre" binding:"required"`
	Login  string `json:"login" binding:"required"`
}

// Register handler
func Register(c *gin.Context) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verificar si el email ya existe
	var existing models.Usuario
	if err := db.DB.Where("email = ?", input.Email).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "El correo electrónico ya está registrado"})
		return
	}

	// Cifrar la contraseña con bcrypt
	hashed, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error interno al procesar la contraseña"})
		return
	}

	usuario := models.Usuario{
		Nombre:       input.Nombre,
		Email:        input.Email,
		Login:        input.Login,
		PasswordHash: string(hashed),
		Rol:          "Cliente", // Rol por defecto
		Estado:       "Activo",
		JoinedDate:   time.Now(),
	}

	if err := db.DB.Create(&usuario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear el usuario"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Usuario registrado exitosamente"})
}

// Login handler
func Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var usuario models.Usuario
	if err := db.DB.Where("email = ?", input.Email).First(&usuario).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciales inválidas"})
		return
	}

	// Verificar contraseña
	if err := bcrypt.CompareHashAndPassword([]byte(usuario.PasswordHash), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciales inválidas"})
		return
	}

	// Generar Token JWT
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID: usuario.ID,
		Email:  usuario.Email,
		Rol:    usuario.Rol,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al generar sesión"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
		"usuario": gin.H{
			"id":     usuario.ID,
			"nombre": usuario.Nombre,
			"email":  usuario.Email,
			"login":  usuario.Login,
			"rol":    usuario.Rol,
		},
	})
}

// GetProfile handler
func GetProfile(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
		return
	}

	userID := userIDVal.(uuid.UUID)
	var usuario models.Usuario
	if err := db.DB.First(&usuario, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	c.JSON(http.StatusOK, usuario)
}

// UpdateProfile handler
func UpdateProfile(c *gin.Context) {
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autorizado"})
		return
	}

	userID := userIDVal.(uuid.UUID)

	var input UpdateProfileInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var usuario models.Usuario
	if err := db.DB.First(&usuario, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	usuario.Nombre = input.Nombre
	usuario.Login = input.Login

	if err := db.DB.Save(&usuario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al guardar el perfil"})
		return
	}

	c.JSON(http.StatusOK, usuario)
}

// GetAllUsers devuelve todos los usuarios
// GET /api/user/all
func GetAllUsers(c *gin.Context) {
	// Verificar si el solicitante es administrador
	userRolVal, exists := c.Get("userRol")
	if !exists || auth.NormalizeRole(userRolVal.(string)) != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Acceso denegado: se requieren permisos de administrador"})
		c.Abort()
		return
	}

	var usuarios []models.Usuario
	if err := db.DB.Order("joined_date desc").Find(&usuarios).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al consultar usuarios"})
		return
	}

	c.JSON(http.StatusOK, usuarios)
}

// AuthMiddleware protects private routes
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Falta cabecera de autorización"})
			c.Abort()
			return
		}

		// Esperamos formato "Bearer <token>"
		const bearerPrefix = "Bearer "
		if len(authHeader) <= len(bearerPrefix) || authHeader[:len(bearerPrefix)] != bearerPrefix {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Formato de autorización inválido"})
			c.Abort()
			return
		}

		tokenString := authHeader[len(bearerPrefix):]
		claims := &Claims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Sesión inválida o expirada"})
			c.Abort()
			return
		}

		// Adjuntar información del usuario al contexto
		c.Set("userID", claims.UserID)
		c.Set("userEmail", claims.Email)
		c.Set("userRol", claims.Rol)

		c.Next()
	}
}

type UpdateUserRoleInput struct {
	Rol string `json:"rol" binding:"required,oneof=Admin Tecnico Cliente"`
}

type UpdateUserStatusInput struct {
	Estado string `json:"estado" binding:"required,oneof=Activo Inactivo"`
}

// UpdateUserRole updates a user's role (Admin only)
func UpdateUserRole(c *gin.Context) {
	userRolVal, exists := c.Get("userRol")
	if !exists || auth.NormalizeRole(userRolVal.(string)) != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Acceso denegado: se requieren permisos de administrador"})
		c.Abort()
		return
	}

	userIDStr := c.Param("id")
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de usuario inválido"})
		return
	}

	var input UpdateUserRoleInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var usuario models.Usuario
	if err := db.DB.First(&usuario, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	usuario.Rol = input.Rol
	if err := db.DB.Save(&usuario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar el rol"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Rol de usuario actualizado con éxito", "usuario": usuario})
}

// UpdateUserStatus updates a user's status (Admin only)
func UpdateUserStatus(c *gin.Context) {
	userRolVal, exists := c.Get("userRol")
	if !exists || auth.NormalizeRole(userRolVal.(string)) != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Acceso denegado: se requieren permisos de administrador"})
		c.Abort()
		return
	}

	userIDStr := c.Param("id")
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de usuario inválido"})
		return
	}

	var input UpdateUserStatusInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var usuario models.Usuario
	if err := db.DB.First(&usuario, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	usuario.Estado = input.Estado
	if err := db.DB.Save(&usuario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al actualizar el estado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Estado de usuario actualizado con éxito", "usuario": usuario})
}

// DeleteUser deletes a user (soft delete, Admin only)
func DeleteUser(c *gin.Context) {
	userRolVal, exists := c.Get("userRol")
	if !exists || auth.NormalizeRole(userRolVal.(string)) != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Acceso denegado: se requieren permisos de administrador"})
		c.Abort()
		return
	}

	userIDStr := c.Param("id")
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de usuario inválido"})
		return
	}

	var usuario models.Usuario
	if err := db.DB.First(&usuario, "id = ?", userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	if err := db.DB.Delete(&usuario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al eliminar el usuario"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Usuario eliminado con éxito"})
}
