package payment

// DEPRECATED: GenerateCardToken debe ejecutarse en el FRONTEND usando @mercadopago/sdk-js
// El frontend es responsable de generar el token de la tarjeta de crédito
// y enviarlo al backend en la solicitud CreatePayment.
// Motivo: seguridad PCI-DSS — los datos de la tarjeta NUNCA deben pasar por el servidor.
