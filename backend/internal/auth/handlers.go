package auth

import (
	"net/http"
	"time"

	"backend/internal/db"
	"backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var existing models.Usuario
	if err := db.DB.Where("email = ?", input.Email).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "El correo electrónico ya está registrado"})
		return
	}

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
		Rol:          "Cliente",
		Estado:       "Activo",
		JoinedDate:   time.Now(),
	}

	if err := db.DB.Create(&usuario).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear el usuario"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Usuario registrado exitosamente"})
}

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

	if err := bcrypt.CompareHashAndPassword([]byte(usuario.PasswordHash), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciales inválidas"})
		return
	}

	tokenString, err := GenerateToken(usuario.ID, usuario.Email, usuario.Rol)
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
