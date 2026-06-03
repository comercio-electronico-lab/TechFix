package payment

import (
	"context"
	"fmt"
	"os"
	"strconv"

	"github.com/mercadopago/sdk-go/pkg/config"
	"github.com/mercadopago/sdk-go/pkg/payment"
)

func CreateMercadoPagoPayment(amount float64, email, description string, installments int, token string) (*payment.Response, error) {
	accessToken := os.Getenv("MERCADO_PAGO_ACCESS_TOKEN")
	if accessToken == "" {
		return nil, fmt.Errorf("MERCADO_PAGO_ACCESS_TOKEN no configurado")
	}

	cfg, err := config.New(accessToken)
	if err != nil {
		return nil, fmt.Errorf("error configurando SDK: %w", err)
	}

	client := payment.NewClient(cfg)

	request := payment.Request{
		TransactionAmount: amount,
		Description:       description,
		PaymentMethodID:   "visa",
		Token:             token,
		Installments:      installments,
		Payer: &payment.PayerRequest{
			Email: email,
		},
	}

	notifURL := os.Getenv("NOTIFICATION_URL")
	if notifURL != "" && notifURL != "http://localhost:8080" {
		request.NotificationURL = fmt.Sprintf("%s/api/webhooks/mercado-pago", notifURL)
	}

	resource, err := client.Create(context.Background(), request)
	if err != nil {
		return nil, fmt.Errorf("error creando pago en Mercado Pago: %w", err)
	}

	return resource, nil
}

func GetMercadoPagoPayment(paymentID string) (*payment.Response, error) {
	accessToken := os.Getenv("MERCADO_PAGO_ACCESS_TOKEN")
	if accessToken == "" {
		return nil, fmt.Errorf("MERCADO_PAGO_ACCESS_TOKEN no configurado")
	}

	cfg, err := config.New(accessToken)
	if err != nil {
		return nil, fmt.Errorf("error configurando SDK: %w", err)
	}

	client := payment.NewClient(cfg)

	id, err := strconv.ParseInt(paymentID, 10, 64)
	if err != nil {
		return nil, fmt.Errorf("ID de pago inválido: %w", err)
	}

	resource, err := client.Get(context.Background(), int(id))
	if err != nil {
		return nil, fmt.Errorf("error obteniendo pago de Mercado Pago: %w", err)
	}

	return resource, nil
}

func GetPaymentStatus(paymentID string) (string, error) {
	resource, err := GetMercadoPagoPayment(paymentID)
	if err != nil {
		return "", err
	}
	return resource.Status, nil
}

func RefundMercadoPagoPayment(paymentID string) error {
	accessToken := os.Getenv("MERCADO_PAGO_ACCESS_TOKEN")
	if accessToken == "" {
		return fmt.Errorf("MERCADO_PAGO_ACCESS_TOKEN no configurado")
	}

	cfg, err := config.New(accessToken)
	if err != nil {
		return fmt.Errorf("error configurando SDK: %w", err)
	}

	client := payment.NewClient(cfg)

	id, err := strconv.ParseInt(paymentID, 10, 64)
	if err != nil {
		return fmt.Errorf("ID de pago inválido: %w", err)
	}

	_, err = client.Cancel(context.Background(), int(id))
	if err != nil {
		return fmt.Errorf("error reembolsando pago en Mercado Pago: %w", err)
	}

	return nil
}
