package handlers

import (
	"net/http"
	"time"

	"backend/internal/db"
	"backend/internal/models"
	"backend/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type RegisterInput struct {
	Login    string `json:"login" binding:"required"`
	Nombre   string `json:"nombre" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func Register(c *gin.Context) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos: " + err.Error()})
		return
	}

	// Verificar si el email ya está registrado
	var existing models.Usuario
	if err := db.DB.Where("email = ?", input.Email).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "El correo electrónico ya está registrado"})
		return
	}

	// Hashear contraseña
	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al procesar la contraseña"})
		return
	}

	usuario := models.Usuario{
		Login:        input.Login,
		Nombre:       input.Nombre,
		Email:        input.Email,
		Rol:          "Cliente", // Rol predeterminado para el portal público
		Estado:       "Activo",
		JoinedDate:   time.Now(),
		PasswordHash: string(hash),
	}

	if err := db.DB.Create(&usuario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al registrar el usuario: " + err.Error()})
		return
	}

	// Generar JWT
	token, err := utils.GenerateToken(usuario.ID, usuario.Email, usuario.Rol)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al generar sesión"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"token": token,
		"user":  usuario,
	})
}

func Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos requeridos inválidos"})
		return
	}

	// Buscar usuario por correo
	var usuario models.Usuario
	if err := db.DB.Where("email = ?", input.Email).First(&usuario).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciales inválidas (correo o contraseña incorrectos)"})
		return
	}

	// Verificar contraseña
	if err := bcrypt.CompareHashAndPassword([]byte(usuario.PasswordHash), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciales inválidas (correo o contraseña incorrectos)"})
		return
	}

	// Generar JWT
	token, err := utils.GenerateToken(usuario.ID, usuario.Email, usuario.Rol)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al generar sesión"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user":  usuario,
	})
}

func Me(c *gin.Context) {
	// Obtener ID del contexto
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No autenticado"})
		return
	}

	userID, ok := userIDVal.(uuid.UUID)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error de identidad"})
		return
	}

	var usuario models.Usuario
	if err := db.DB.First(&usuario, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	c.JSON(http.StatusOK, usuario)
}
