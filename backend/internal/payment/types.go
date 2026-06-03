package payment

type CreatePaymentRequest struct {
	Amount      float64 `json:"amount" binding:"required,gt=0"`
	Description string  `json:"description" binding:"required"`
	PayerEmail  string  `json:"payer_email" binding:"required,email"`
	Token       string  `json:"token"`
	RepairID    *string `json:"repair_id"`
	Installments int     `json:"installments"`
}

type PaymentResponse struct {
	ID              string  `json:"id"`
	Amount          float64 `json:"amount"`
	Status          string  `json:"status"`
	MercadoPagoID   string  `json:"mercado_pago_id,omitempty"`
	PaymentMethod   string  `json:"payment_method,omitempty"`
	Description     string  `json:"description"`
	CreatedAt       string  `json:"created_at"`
	TransactionURL  string  `json:"transaction_url,omitempty"`
}
