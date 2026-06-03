package diagnostic

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DiagnosticHandlers struct {
	service *DiagnosticService
}

func NewDiagnosticHandlers(db *gorm.DB) *DiagnosticHandlers {
	return &DiagnosticHandlers{
		service: NewDiagnosticService(db),
	}
}

// StartDiagnostic inicia una nueva sesión de diagnóstico
// POST /api/diagnostic/start
func (h *DiagnosticHandlers) StartDiagnostic(c *gin.Context) {
	var req StartDiagnosticRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Capturar IP del cliente
	req.ClientIP = c.ClientIP()

	resp, err := h.service.StartDiagnostic(req)
	if err != nil {
		log.Printf("Error starting diagnostic: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, resp)
}

// AnswerQuestion responde una pregunta y obtiene la siguiente
// POST /api/diagnostic/answer
func (h *DiagnosticHandlers) AnswerQuestion(c *gin.Context) {
	var req AnswerDiagnosticRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := h.service.AnswerDiagnostic(req)
	if err != nil {
		log.Printf("Error answering diagnostic: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// GetSession obtiene una sesión de diagnóstico completa
// GET /api/diagnostic/:sessionId
func (h *DiagnosticHandlers) GetSession(c *gin.Context) {
	sessionIDStr := c.Param("sessionId")

	sessionID, err := uuid.Parse(sessionIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid session ID"})
		return
	}

	session, err := h.service.GetDiagnosticSession(sessionID)
	if err != nil {
		log.Printf("Error getting diagnostic session: %v", err)
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, session)
}

// GetSessionHistory obtiene el historial de turnos de una sesión
// GET /api/diagnostic/:sessionId/history
func (h *DiagnosticHandlers) GetSessionHistory(c *gin.Context) {
	sessionIDStr := c.Param("sessionId")

	sessionID, err := uuid.Parse(sessionIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid session ID"})
		return
	}

	turns, err := h.service.GetSessionTurns(sessionID)
	if err != nil {
		log.Printf("Error getting diagnostic turns: %v", err)
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"session_id": sessionID,
		"turns":      turns,
	})
}

// GetRecommendedProducts obtiene productos recomendados para una sesión
// GET /api/diagnostic/:sessionId/products
func (h *DiagnosticHandlers) GetRecommendedProducts(c *gin.Context) {
	sessionIDStr := c.Param("sessionId")

	sessionID, err := uuid.Parse(sessionIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid session ID"})
		return
	}

	products, err := h.service.GetSessionProducts(sessionID)
	if err != nil {
		log.Printf("Error getting recommended products: %v", err)
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"session_id": sessionID,
		"products":   products,
	})
}
