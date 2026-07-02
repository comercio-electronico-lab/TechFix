package diagnostic

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"backend/internal/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DiagnosticService struct {
	db     *gorm.DB
	apiKey string
}

func NewDiagnosticService(db *gorm.DB) *DiagnosticService {
	apiKey := os.Getenv("API_KEY_IA")
	if apiKey == "" {
		log.Println("Warning: API_KEY_IA not set in environment")
	}

	return &DiagnosticService{
		db:     db,
		apiKey: apiKey,
	}
}

type StartDiagnosticRequest struct {
	DeviceType   string `json:"device_type" binding:"required"`
	InitialIssue string `json:"initial_issue" binding:"required"`
	Brand        string `json:"brand,omitempty"`
	Model        string `json:"model,omitempty"`
	ClientIP     string `json:"client_ip,omitempty"`
}

type StartDiagnosticResponse struct {
	SessionID    uuid.UUID `json:"session_id"`
	Question     string    `json:"question"`
	TurnNumber   int       `json:"turn_number"`
	Status       string    `json:"status"`
}

type AnswerDiagnosticRequest struct {
	SessionID uuid.UUID `json:"session_id" binding:"required"`
	Answer    string    `json:"answer" binding:"required"`
}

type DiagnosticTurnResponse struct {
	TurnNumber   int                     `json:"turn_number"`
	IsTerminal   bool                    `json:"is_terminal"`
	Question     string                  `json:"question,omitempty"`
	Diagnosis    string                  `json:"diagnosis,omitempty"`
	MinPrice     float64                 `json:"estimated_min_price,omitempty"`
	MaxPrice     float64                 `json:"estimated_max_price,omitempty"`
	Products     []RecommendedProductDTO `json:"recommended_products,omitempty"`
}

type RecommendedProductDTO struct {
	Name       string  `json:"name"`
	Category   string  `json:"category"`
	Price      float64 `json:"estimated_price"`
	Reasoning  string  `json:"reasoning"`
	ImageURL   string  `json:"image_url"`
	ProductID  *string `json:"producto_id,omitempty"`
}

type AIResponse struct {
	IsTerminal       bool                  `json:"is_terminal"`
	NextQuestion     string                `json:"next_question,omitempty"`
	Diagnosis        string                `json:"diagnosis,omitempty"`
	EstimatedMinPrice float64              `json:"estimated_min_price,omitempty"`
	EstimatedMaxPrice float64              `json:"estimated_max_price,omitempty"`
	RecommendedParts []AIRecommendedPart   `json:"recommended_parts,omitempty"`
}

type AIRecommendedPart struct {
	Name      string  `json:"name"`
	Category  string  `json:"category"`
	Price     float64 `json:"estimated_price"`
	Reasoning string  `json:"reasoning"`
}

// StartDiagnostic inicia una nueva sesión de diagnóstico (anónima, sin autenticación)
func (s *DiagnosticService) StartDiagnostic(req StartDiagnosticRequest) (*StartDiagnosticResponse, error) {
	session := models.DiagnosticSession{
		Base:         models.Base{ID: uuid.New()},
		UserID:       nil,
		DeviceID:     nil,
		DeviceType:   req.DeviceType,
		Brand:        req.Brand,
		Model:        req.Model,
		InitialIssue: req.InitialIssue,
		ClientIP:     req.ClientIP,
		Status:       "in_progress",
		IsCompleted:  false,
	}

	if err := s.db.Create(&session).Error; err != nil {
		return nil, fmt.Errorf("failed to create diagnostic session: %w", err)
	}

	// Generar primera pregunta con IA
	firstQuestion, err := s.generateFirstQuestion(session.ID, req.DeviceType, req.InitialIssue)
	if err != nil {
		return nil, fmt.Errorf("failed to generate first question: %w", err)
	}

	// Guardar primer turno
	turn := models.DiagnosticTurn{
		ID:                  uuid.New(),
		DiagnosticSessionID: session.ID,
		Question:            firstQuestion,
		TurnNumber:          1,
	}

	if err := s.db.Create(&turn).Error; err != nil {
		return nil, fmt.Errorf("failed to create diagnostic turn: %w", err)
	}

	return &StartDiagnosticResponse{
		SessionID:  session.ID,
		Question:   firstQuestion,
		TurnNumber: 1,
		Status:     "in_progress",
	}, nil
}

// AnswerDiagnostic procesa una respuesta del usuario y genera la siguiente pregunta o diagnóstico
func (s *DiagnosticService) AnswerDiagnostic(req AnswerDiagnosticRequest) (*DiagnosticTurnResponse, error) {
	// Obtener sesión actual
	var session models.DiagnosticSession
	if err := s.db.First(&session, "id = ?", req.SessionID).Error; err != nil {
		return nil, fmt.Errorf("session not found: %w", err)
	}

	// Obtener el último turno para obtener el número
	var lastTurn models.DiagnosticTurn
	s.db.Where("diagnostic_session_id = ?", session.ID).Order("turn_number DESC").First(&lastTurn)

	currentTurn := lastTurn.TurnNumber + 1

	// Actualizar el turno anterior con la respuesta del usuario
	if err := s.db.Model(&lastTurn).Update("user_answer", req.Answer).Error; err != nil {
		return nil, fmt.Errorf("failed to update user answer: %w", err)
	}

	// Obtener historial de conversación
	conversationHistory := s.buildConversationHistory(session.ID)

	// Generar siguiente pregunta o diagnóstico
	aiResp, err := s.generateNextStep(
		session.ID,
		session.DeviceType,
		session.InitialIssue,
		conversationHistory,
		req.Answer,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to generate next step: %w", err)
	}

	response := &DiagnosticTurnResponse{
		TurnNumber: currentTurn,
		IsTerminal: aiResp.IsTerminal,
	}

	if aiResp.IsTerminal {
		// Guardar diagnóstico final
		session.FinalDiagnosis = aiResp.Diagnosis
		session.Status = "completed"
		session.IsCompleted = true
		session.EstimatedMinPrice = aiResp.EstimatedMinPrice
		session.EstimatedMaxPrice = aiResp.EstimatedMaxPrice

		if err := s.db.Save(&session).Error; err != nil {
			return nil, fmt.Errorf("failed to update session: %w", err)
		}

		// Guardar productos recomendados con imágenes automáticas
		for _, part := range aiResp.RecommendedParts {
			// Generar URL de imagen automáticamente (basada en device_type y nombre del producto)
			imageURL := GetImageURLForProduct(session.DeviceType, part.Name)

			product := models.AIRecommendedProduct{
				ID:                  uuid.New(),
				DiagnosticSessionID: session.ID,
				Name:                part.Name,
				Category:            part.Category,
				EstimatedPrice:      part.Price,
				AIReasoning:         part.Reasoning,
			}

			// Intentar vincular con un producto real de la base de datos
			var dbProd models.Producto
			if err := s.db.Where("nombre ILIKE ?", "%"+part.Name+"%").First(&dbProd).Error; err == nil {
				product.ProductoID = &dbProd.ID
			}

			if err := s.db.Create(&product).Error; err != nil {
				log.Printf("failed to save recommended product: %v", err)
			}

			// Agregar URL a la respuesta
			_ = imageURL // Usada en response
		}

		response.Diagnosis = aiResp.Diagnosis
		response.MinPrice = aiResp.EstimatedMinPrice
		response.MaxPrice = aiResp.EstimatedMaxPrice

		for _, part := range aiResp.RecommendedParts {
			imageURL := GetImageURLForProduct(session.DeviceType, part.Name)
			
			var dbProd models.AIRecommendedProduct
			var prodIDStr *string
			if err := s.db.Where("diagnostic_session_id = ? AND name = ?", session.ID, part.Name).First(&dbProd).Error; err == nil && dbProd.ProductoID != nil {
				sID := dbProd.ProductoID.String()
				prodIDStr = &sID
			}

			response.Products = append(response.Products, RecommendedProductDTO{
				Name:      part.Name,
				Category:  part.Category,
				Price:     part.Price,
				Reasoning: part.Reasoning,
				ImageURL:  imageURL,
				ProductID: prodIDStr,
			})
		}
	} else {
		// Guardar siguiente pregunta
		newTurn := models.DiagnosticTurn{
			ID:                  uuid.New(),
			DiagnosticSessionID: session.ID,
			Question:            aiResp.NextQuestion,
			TurnNumber:          currentTurn,
		}

		if err := s.db.Create(&newTurn).Error; err != nil {
			return nil, fmt.Errorf("failed to create next turn: %w", err)
		}

		response.Question = aiResp.NextQuestion
	}

	return response, nil
}

// generateFirstQuestion genera la primera pregunta basada en el problema inicial
func (s *DiagnosticService) generateFirstQuestion(sessionID uuid.UUID, deviceType, initialIssue string) (string, error) {
	if s.apiKey == "" {
		if strings.ToLower(deviceType) == "laptop" {
			return "¿El dispositivo Dell o Apple enciende alguna luz LED o emite algún pitido al presionar el botón de encendido?", nil
		}
		return "¿El dispositivo muestra algún símbolo de carga o emite una pequeña vibración cuando lo conectas a la corriente?", nil
	}

	prompt := fmt.Sprintf(`Eres un experto técnico en reparación de dispositivos electrónicos.
Un cliente reporta el siguiente problema con su %s: "%s"

Genera una pregunta diagnóstica clara y específica que ayude a identificar la causa del problema.
La pregunta debe ser:
- Comprensible para usuarios no técnicos
- Enfocada en síntomas observables
- De una sola pregunta

Responde SOLO con la pregunta, sin explicaciones adicionales.`, deviceType, initialIssue)

	resp, err := s.callAI(prompt)
	if err != nil {
		return "", err
	}

	return strings.TrimSpace(resp), nil
}

// generateNextStep genera la siguiente pregunta o diagnóstico terminal
func (s *DiagnosticService) generateNextStep(
	sessionID uuid.UUID,
	deviceType string,
	initialIssue string,
	conversationHistory string,
	latestAnswer string,
) (*AIResponse, error) {
	if s.apiKey == "" {
		var count int64
		s.db.Model(&models.DiagnosticTurn{}).Where("diagnostic_session_id = ?", sessionID).Count(&count)

		if count == 1 {
			return &AIResponse{
				IsTerminal:   false,
				NextQuestion: "Entendido. ¿Has intentado utilizar otro cargador o cable USB original? ¿Notaste si el dispositivo se calienta inusualmente?",
			}, nil
		}
		if count == 2 {
			return &AIResponse{
				IsTerminal:   false,
				NextQuestion: "¿El equipo ha sufrido algún golpe reciente, caída fuerte, o ha estado expuesto a humedad/líquidos últimamente?",
			}, nil
		}

		// Turn >= 3: terminal diagnosis!
		if strings.ToLower(deviceType) == "laptop" {
			return &AIResponse{
				IsTerminal:        true,
				Diagnosis:         "Se identificó un fallo severo en la celda de almacenamiento de energía y degradación química de la batería. Requiere reemplazo preventivo de la batería original para solucionar fallas de encendido.",
				EstimatedMinPrice: 95.00,
				EstimatedMaxPrice: 150.00,
				RecommendedParts: []AIRecommendedPart{
					{
						Name:      "Batería Dell XPS 13",
						Category:  "Baterías",
						Price:     89.99,
						Reasoning: "La batería original ha cumplido su ciclo de vida y no retiene carga.",
					},
				},
			}, nil
		}

		// Default smartphone
		return &AIResponse{
			IsTerminal:        true,
			Diagnosis:         "Desgaste crítico de la batería de iones de litio y posible daño menor en la placa de carga. Se aconseja reemplazo de celda de batería original para reestablecer la autonomía.",
			EstimatedMinPrice: 45.00,
			EstimatedMaxPrice: 85.00,
			RecommendedParts: []AIRecommendedPart{
				{
					Name:      "Batería iPhone 14",
					Category:  "Baterías",
					Price:     59.99,
					Reasoning: "La batería actual presenta una capacidad de retención de carga inferior al 80% (degradación física).",
				},
			},
		}, nil
	}

	prompt := fmt.Sprintf(`Eres un experto técnico en reparación de %s.
El cliente reportó inicialmente: "%s"

Historial de conversación:
%s

Última respuesta del cliente: "%s"

Basándote en el historial:
1. Determina si tienes SUFICIENTE información para hacer un diagnóstico (después de 3-5 preguntas o si el problema está claro)
2. Si NO tienes suficiente información, genera una siguiente pregunta diagnóstica clara y específica
3. Si SÍ tienes suficiente información:
   - Proporciona un diagnóstico detallado del problema
   - Estima rango de precios (en ARS)
   - Recomienda 2-3 partes/repuestos específicos con precio estimado y justificación

Responde con JSON válido en este formato:
{
  "is_terminal": boolean,
  "next_question": "texto de la pregunta (solo si is_terminal=false)",
  "diagnosis": "diagnóstico detallado (solo si is_terminal=true)",
  "estimated_min_price": número (solo si is_terminal=true),
  "estimated_max_price": número (solo si is_terminal=true),
  "recommended_parts": [
    {
      "name": "nombre del repuesto",
      "category": "categoría",
      "estimated_price": número,
      "reasoning": "por qué se recomienda"
    }
  ]
}

Solo responde con el JSON, sin texto adicional.`, deviceType, initialIssue, conversationHistory, latestAnswer)

	resp, err := s.callAI(prompt)
	if err != nil {
		return nil, err
	}

	// Limpiar respuesta si viene entre backticks (markdown)
	cleanResp := strings.TrimSpace(resp)
	if strings.HasPrefix(cleanResp, "```") {
		// Remover ```json o ``` del inicio
		cleanResp = strings.TrimPrefix(cleanResp, "```json")
		cleanResp = strings.TrimPrefix(cleanResp, "```")
		// Remover ``` del final
		cleanResp = strings.TrimSuffix(cleanResp, "```")
		cleanResp = strings.TrimSpace(cleanResp)
	}

	var aiResp AIResponse
	if err := json.Unmarshal([]byte(cleanResp), &aiResp); err != nil {
		return nil, fmt.Errorf("failed to parse AI response: %w, response: %s", err, cleanResp)
	}

	return &aiResp, nil
}

// buildConversationHistory construye el historial de preguntas y respuestas
func (s *DiagnosticService) buildConversationHistory(sessionID uuid.UUID) string {
	var turns []models.DiagnosticTurn
	s.db.Where("diagnostic_session_id = ?", sessionID).Order("turn_number ASC").Find(&turns)

	var history strings.Builder
	for _, turn := range turns {
		history.WriteString(fmt.Sprintf("P%d: %s\n", turn.TurnNumber, turn.Question))
		if turn.UserAnswer != "" {
			history.WriteString(fmt.Sprintf("R%d: %s\n\n", turn.TurnNumber, turn.UserAnswer))
		}
	}

	return history.String()
}

// callAI realiza una llamada a Groq API mediante HTTP
func (s *DiagnosticService) callAI(prompt string) (string, error) {
	if s.apiKey == "" {
		return "", fmt.Errorf("API_KEY_IA not configured")
	}

	// Estructura del request para Groq API (compatible con OpenAI)
	requestBody := map[string]interface{}{
		"model":       "llama-3.3-70b-versatile",
		"messages": []map[string]string{
			{
				"role":    "user",
				"content": prompt,
			},
		},
		"max_tokens":  1024,
		"temperature": 0.7,
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %w", err)
	}

	// Crear request HTTP a Groq
	req, err := http.NewRequest("POST", "https://api.groq.com/openai/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	// Configurar headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", s.apiKey))

	// Ejecutar request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("AI API call failed: %w", err)
	}
	defer resp.Body.Close()

	// Leer respuesta
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %w", err)
	}

	// Verificar status code
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("API error (status %d): %s", resp.StatusCode, string(body))
	}

	// Parsear respuesta de Groq (formato OpenAI)
	var apiResp struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.Unmarshal(body, &apiResp); err != nil {
		return "", fmt.Errorf("failed to parse response: %w, response: %s", err, string(body))
	}

	if len(apiResp.Choices) == 0 {
		return "", fmt.Errorf("empty response from AI")
	}

	return apiResp.Choices[0].Message.Content, nil
}

// GetDiagnosticSession obtiene una sesión de diagnóstico completa
func (s *DiagnosticService) GetDiagnosticSession(sessionID uuid.UUID) (*models.DiagnosticSession, error) {
	var session models.DiagnosticSession
	if err := s.db.First(&session, "id = ?", sessionID).Error; err != nil {
		return nil, fmt.Errorf("session not found: %w", err)
	}

	return &session, nil
}

// GetSessionTurns obtiene todos los turnos de una sesión
func (s *DiagnosticService) GetSessionTurns(sessionID uuid.UUID) ([]models.DiagnosticTurn, error) {
	var turns []models.DiagnosticTurn
	if err := s.db.Where("diagnostic_session_id = ?", sessionID).
		Order("turn_number ASC").
		Find(&turns).Error; err != nil {
		return nil, fmt.Errorf("failed to get turns: %w", err)
	}

	return turns, nil
}

// GetSessionProducts obtiene productos recomendados para una sesión
func (s *DiagnosticService) GetSessionProducts(sessionID uuid.UUID) ([]models.AIRecommendedProduct, error) {
	var products []models.AIRecommendedProduct
	if err := s.db.Where("diagnostic_session_id = ?", sessionID).
		Find(&products).Error; err != nil {
		return nil, fmt.Errorf("failed to get products: %w", err)
	}

	return products, nil
}
