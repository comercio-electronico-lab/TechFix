package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Base struct {
	ID        uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

func (b *Base) BeforeCreate(tx *gorm.DB) error {
	if b.ID == uuid.Nil {
		b.ID = uuid.New()
	}
	return nil
}

type Usuario struct {
	Base
	Login        string    `gorm:"size:60;not null" json:"login" yaml:"login"`
	Nombre       string    `gorm:"size:255;not null" json:"nombre" yaml:"nombre"`
	Email        string    `gorm:"size:100;uniqueIndex;not null" json:"email" yaml:"email"`
	PasswordHash string    `gorm:"size:255;not null" json:"-" yaml:"password_hash,omitempty"`
	Rol          string    `gorm:"size:20;default:'Cliente'" json:"rol" yaml:"rol"`
	Estado       string    `gorm:"size:20;default:'Activo'" json:"estado" yaml:"estado"`
	JoinedDate   time.Time `json:"joined_date" yaml:"joined_date"`
	Telefono     string    `gorm:"size:50" json:"teléfono" yaml:"teléfono"`
	Direccion    string    `gorm:"size:255" json:"dirección" yaml:"dirección"`
	Ciudad       string    `gorm:"size:100" json:"ciudad" yaml:"ciudad"`
	DocumentId   string    `gorm:"size:50" json:"documentId" yaml:"documentId"`
}

func (Usuario) TableName() string {
	return "usuarios"
}

type Device struct {
	Base
	UserID       uuid.UUID `gorm:"type:uuid;not null" json:"user_id" yaml:"user_id"`
	User         Usuario   `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Brand        string    `gorm:"size:80;not null" json:"brand" yaml:"brand"`
	Model        string    `gorm:"size:120;not null" json:"model" yaml:"model"`
	SerialNumber string    `gorm:"size:100;uniqueIndex;not null" json:"serial_number" yaml:"serial_number"`
	DeviceType   string    `gorm:"size:20;not null" json:"device_type" yaml:"device_type"`
	PurchaseDate *time.Time `json:"purchase_date" yaml:"purchase_date"`
}

func (Device) TableName() string {
	return "techfix_devices"
}

type Producto struct {
	Base
	Nombre          string  `gorm:"size:255;not null" json:"nombre" yaml:"nombre"`
	Descripcion     string  `gorm:"type:text" json:"descripcion" yaml:"descripcion"`
	SKU             string  `gorm:"size:100;uniqueIndex" json:"sku" yaml:"sku"`
	PrecioVenta     float64 `json:"precio_venta" yaml:"precio_venta"`
	PrecioCosto     float64 `json:"precio_costo" yaml:"precio_costo"`
	StockActual     int     `gorm:"default:0" json:"stock_actual" yaml:"stock_actual"`
	StockMinimo     int     `gorm:"default:5" json:"stock_minimo" yaml:"stock_minimo"`
	Categoria       string  `gorm:"size:100" json:"categoria" yaml:"categoria"`
	ImagenURL       string  `json:"imagen_url" yaml:"imagen_url"`
	EstadoComercial string  `gorm:"size:50" json:"status" yaml:"estado_comercial"`
}

func (Producto) TableName() string {
	return "productos"
}

type PigNode struct {
	ID                uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	ParentNodeID      *uuid.UUID `gorm:"type:uuid;index" json:"parent_node_id" yaml:"parent_node_id"`
	DeviceType        string    `gorm:"size:20;not null" json:"device_type" yaml:"device_type"`
	QuestionText      string    `gorm:"type:text;not null" json:"question_text" yaml:"question_text"`
	AnswerOption      string    `gorm:"size:200" json:"answer_option" yaml:"answer_option"`
	PreliminaryResult string    `gorm:"size:255" json:"preliminary_result" yaml:"preliminary_result"`
	EstimatedMin      float64   `json:"estimated_min" yaml:"estimated_min"`
	EstimatedMax      float64   `json:"estimated_max" yaml:"estimated_max"`
	IsTerminal        bool      `gorm:"default:false" json:"is_terminal" yaml:"is_terminal"`
	OrderIndex        int       `gorm:"default:0" json:"order_index" yaml:"order_index"`
}

func (PigNode) TableName() string {
	return "techfix_pig_nodes"
}

func (n *PigNode) BeforeCreate(tx *gorm.DB) error {
	if n.ID == uuid.Nil {
		n.ID = uuid.New()
	}
	return nil
}

type Proveedor struct {
	Base
	Nombre   string `gorm:"size:255;not null" json:"nombre" yaml:"nombre"`
	Contacto string `gorm:"size:100" json:"contacto" yaml:"contacto"`
	Telefono string `gorm:"size:20" json:"telefono" yaml:"telefono"`
	Email    string `gorm:"size:100" json:"email" yaml:"email"`
}

func (Proveedor) TableName() string {
	return "proveedores"
}

type PedidoRepuesto struct {
	Base
	ProveedorID  uuid.UUID  `gorm:"type:uuid;not null" json:"proveedor_id" yaml:"proveedor_id"`
	Proveedor    Proveedor  `gorm:"foreignKey:ProveedorID" json:"proveedor,omitempty"`
	ProductoID   uuid.UUID  `gorm:"type:uuid;not null" json:"producto_id" yaml:"producto_id"`
	Producto     Producto   `gorm:"foreignKey:ProductoID" json:"producto,omitempty"`
	RepairID     *uuid.UUID `gorm:"type:uuid" json:"repair_id" yaml:"repair_id"`
	Cantidad     int        `json:"cantidad" yaml:"cantidad"`
	Estado       string     `gorm:"size:30;default:'solicitado'" json:"estado" yaml:"estado"`
	FechaLlegada *time.Time `json:"fecha_llegada" yaml:"fecha_llegada"`
}

func (PedidoRepuesto) TableName() string {
	return "pedidos_repuesto"
}

type Transaccion struct {
	Base
	RepairID   uuid.UUID `gorm:"type:uuid;not null" json:"repair_id" yaml:"repair_id"`
	RepairOrder RepairOrder `gorm:"foreignKey:RepairID" json:"repair_order,omitempty"`
	UsuarioID  uuid.UUID `gorm:"type:uuid;not null" json:"usuario_id" yaml:"usuario_id"`
	Usuario    Usuario   `gorm:"foreignKey:UsuarioID" json:"usuario,omitempty"`
	Monto      float64   `json:"monto" yaml:"monto"`
	Metodo     string    `json:"metodo" yaml:"metodo"`
	Estado     string    `json:"estado" yaml:"estado"`
	Referencia string    `json:"referencia" yaml:"referencia"`
}

func (Transaccion) TableName() string {
	return "transacciones"
}

type TransaccionProducto struct {
	ID         uuid.UUID   `gorm:"type:uuid;primaryKey" json:"id"`
	TransaccionID uuid.UUID `gorm:"type:uuid;not null;index" json:"transaccion_id"`
	Transaccion Transaccion `gorm:"foreignKey:TransaccionID" json:"transaccion,omitempty"`
	ProductoID uuid.UUID   `gorm:"type:uuid;not null;index" json:"producto_id"`
	Producto   Producto    `gorm:"foreignKey:ProductoID" json:"producto,omitempty"`
	Cantidad   int         `json:"cantidad"`
	PrecioUnitario float64 `json:"precio_unitario"`
	Subtotal   float64    `json:"subtotal"`
	CreatedAt  time.Time  `json:"created_at"`
}

func (TransaccionProducto) TableName() string {
	return "transaccion_producto"
}

func (t *TransaccionProducto) BeforeCreate(tx *gorm.DB) error {
	if t.ID == uuid.Nil {
		t.ID = uuid.New()
	}
	return nil
}

type PigSession struct {
	Base
	UserID            uuid.UUID `gorm:"type:uuid;not null" json:"user_id" yaml:"user_id"`
	User              Usuario   `gorm:"foreignKey:UserID" json:"user,omitempty"`
	DeviceID          *uuid.UUID `gorm:"type:uuid" json:"device_id" yaml:"device_id"`
	Device            *Device    `gorm:"foreignKey:DeviceID" json:"device,omitempty"`
	SymptomPath       []byte    `gorm:"type:jsonb" json:"symptom_path" yaml:"symptom_path"`
	PreliminaryDiagnosis string  `gorm:"size:255" json:"preliminary_diagnosis" yaml:"preliminary_diagnosis"`
	EstimatedPriceMin float64   `json:"estimated_price_min" yaml:"estimated_price_min"`
	EstimatedPriceMax float64   `json:"estimated_price_max" yaml:"estimated_price_max"`
	ConvertedToOrder  bool      `gorm:"default:false" json:"converted_to_order" yaml:"converted_to_order"`
}

func (PigSession) TableName() string {
	return "techfix_pig_sessions"
}

type RepairOrder struct {
	Base
	UserID       uuid.UUID  `gorm:"type:uuid;not null" json:"user_id" yaml:"user_id"`
	User         Usuario    `gorm:"foreignKey:UserID" json:"user,omitempty"`
	DeviceID     uuid.UUID  `gorm:"type:uuid;not null" json:"device_id" yaml:"device_id"`
	Device       Device     `gorm:"foreignKey:DeviceID" json:"device,omitempty"`
	PigSessionID *uuid.UUID `gorm:"type:uuid" json:"pig_session_id" yaml:"pig_session_id"`
	PigSession   *PigSession `gorm:"foreignKey:PigSessionID" json:"pig_session,omitempty"`
	TechnicianID *uuid.UUID `gorm:"type:uuid" json:"technician_id" yaml:"technician_id"`
	Technician   *Usuario   `gorm:"foreignKey:TechnicianID" json:"technician,omitempty"`
	AppointmentDatetime time.Time `json:"appointment_datetime" yaml:"appointment_datetime"`
	Status       string     `gorm:"size:30;default:'pending'" json:"status" yaml:"status"`
	PartType     string     `gorm:"size:20" json:"part_type" yaml:"part_type"` // original, compatible, economic
	DiagnosisFinal string   `gorm:"type:text" json:"diagnosis_final" yaml:"diagnosis_final"`
	EstimatedPriceMin float64 `json:"estimated_price_min" yaml:"estimated_price_min"`
	EstimatedPriceMax float64 `json:"estimated_price_max" yaml:"estimated_price_max"`
	FinalPrice   float64    `json:"final_price" yaml:"final_price"`
	Notes        string     `gorm:"type:text" json:"notes" yaml:"notes"`
	Payments     []Payment  `gorm:"foreignKey:RepairID" json:"payments,omitempty"`
}

func (RepairOrder) TableName() string {
	return "techfix_repair_orders"
}

type RepairTracking struct {
	Base
	RepairID       uuid.UUID   `gorm:"type:uuid;not null" json:"repair_id" yaml:"repair_id"`
	RepairOrder    RepairOrder `gorm:"foreignKey:RepairID" json:"repair_order,omitempty"`
	PreviousStatus string      `gorm:"size:50" json:"previous_status" yaml:"previous_status"`
	NewStatus      string      `gorm:"size:50" json:"new_status" yaml:"new_status"`
	ChangedBy      uuid.UUID   `gorm:"type:uuid;not null" json:"changed_by" yaml:"changed_by"`
	User           Usuario     `gorm:"foreignKey:ChangedBy" json:"user,omitempty"`
	Notes          string      `gorm:"type:text" json:"notes" yaml:"notes"`
	NotificationSent bool      `gorm:"default:false" json:"notification_sent" yaml:"notification_sent"`
}

func (RepairTracking) TableName() string {
	return "techfix_repair_tracking"
}

type Warranty struct {
	Base
	RepairID     uuid.UUID   `gorm:"type:uuid;not null;unique" json:"repair_id" yaml:"repair_id"`
	RepairOrder  RepairOrder `gorm:"foreignKey:RepairID" json:"repair_order,omitempty"`
	UserID       uuid.UUID   `gorm:"type:uuid;not null" json:"user_id" yaml:"user_id"`
	User         Usuario     `gorm:"foreignKey:UserID" json:"user,omitempty"`
	DeviceID     uuid.UUID   `gorm:"type:uuid;not null" json:"device_id" yaml:"device_id"`
	Device       Device      `gorm:"foreignKey:DeviceID" json:"device,omitempty"`
	WarrantyDays int         `gorm:"default:30" json:"warranty_days" yaml:"warranty_days"`
	StartDate    time.Time   `json:"start_date" yaml:"start_date"`
	EndDate      time.Time   `json:"end_date" yaml:"end_date"`
	IsActive     bool        `gorm:"default:true" json:"is_active" yaml:"is_active"`
	WarrantyToken string     `gorm:"size:64;uniqueIndex;not null" json:"warranty_token" yaml:"warranty_token"`
}

func (Warranty) TableName() string {
	return "techfix_warranties"
}

type PigNodeProducto struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey" json:"id"`
	PigNodeID   uuid.UUID `gorm:"type:uuid;not null;index" json:"pig_node_id"`
	PigNode     PigNode   `gorm:"foreignKey:PigNodeID" json:"pig_node,omitempty"`
	ProductoID  uuid.UUID `gorm:"type:uuid;not null;index" json:"producto_id"`
	Producto    Producto  `gorm:"foreignKey:ProductoID" json:"producto,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
}

func (PigNodeProducto) TableName() string {
	return "pig_node_producto"
}

func (p *PigNodeProducto) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}

type RepairOrderProducto struct {
	ID         uuid.UUID   `gorm:"type:uuid;primaryKey" json:"id"`
	RepairID   uuid.UUID   `gorm:"type:uuid;not null;index" json:"repair_id"`
	RepairOrder RepairOrder `gorm:"foreignKey:RepairID" json:"repair_order,omitempty"`
	ProductoID uuid.UUID   `gorm:"type:uuid;not null;index" json:"producto_id"`
	Producto   Producto    `gorm:"foreignKey:ProductoID" json:"producto,omitempty"`
	Cantidad   int         `json:"cantidad"`
	PrecioUnitario float64 `json:"precio_unitario"`
	Subtotal   float64    `json:"subtotal"`
	CreatedAt  time.Time  `json:"created_at"`
}

func (RepairOrderProducto) TableName() string {
	return "repair_order_producto"
}

func (r *RepairOrderProducto) BeforeCreate(tx *gorm.DB) error {
	if r.ID == uuid.Nil {
		r.ID = uuid.New()
	}
	return nil
}

type Payment struct {
	Base
	UserID              uuid.UUID `gorm:"type:uuid;not null" json:"user_id" yaml:"user_id"`
	User                Usuario   `gorm:"foreignKey:UserID" json:"user,omitempty"`
	RepairID            *uuid.UUID `gorm:"type:uuid" json:"repair_id" yaml:"repair_id"`
	RepairOrder         *RepairOrder `gorm:"foreignKey:RepairID" json:"repair_order,omitempty"`
	Amount              float64   `json:"amount" yaml:"amount"`
	Currency            string    `gorm:"size:10;default:'ARS'" json:"currency" yaml:"currency"`
	Description         string    `gorm:"type:text" json:"description" yaml:"description"`
	MercadoPagoID       string    `gorm:"size:255;uniqueIndex" json:"mercado_pago_id" yaml:"mercado_pago_id"`
	Status              string    `gorm:"size:50;default:'pending'" json:"status" yaml:"status"`
	PaymentMethod       string    `gorm:"size:50" json:"payment_method" yaml:"payment_method"`
	TransactionReference string    `gorm:"size:255" json:"transaction_reference" yaml:"transaction_reference"`
	PayerEmail          string    `gorm:"size:100" json:"payer_email" yaml:"payer_email"`
	PaymentDetails      string    `gorm:"type:jsonb" json:"payment_details" yaml:"payment_details"`
}

func (Payment) TableName() string {
	return "techfix_payments"
}

type DiagnosticSession struct {
	Base
	UserID            *uuid.UUID `gorm:"type:uuid" json:"user_id" yaml:"user_id"`
	User              *Usuario   `gorm:"foreignKey:UserID" json:"user,omitempty"`
	DeviceID          *uuid.UUID `gorm:"type:uuid" json:"device_id" yaml:"device_id"`
	Device            *Device    `gorm:"foreignKey:DeviceID" json:"device,omitempty"`
	DeviceType        string     `gorm:"size:50;not null" json:"device_type" yaml:"device_type"`
	Brand             string     `gorm:"size:100" json:"brand" yaml:"brand"`
	Model             string     `gorm:"size:200" json:"model" yaml:"model"`
	InitialIssue      string     `gorm:"type:text;not null" json:"initial_issue" yaml:"initial_issue"`
	FinalDiagnosis    string     `gorm:"type:text" json:"final_diagnosis" yaml:"final_diagnosis"`
	EstimatedMinPrice float64    `json:"estimated_min_price" yaml:"estimated_min_price"`
	EstimatedMaxPrice float64    `json:"estimated_max_price" yaml:"estimated_max_price"`
	ClientIP          string     `gorm:"size:45;index" json:"client_ip" yaml:"client_ip"`
	Status            string     `gorm:"size:20;default:'in_progress'" json:"status" yaml:"status"`
	IsCompleted       bool       `gorm:"default:false" json:"is_completed" yaml:"is_completed"`
}

func (DiagnosticSession) TableName() string {
	return "techfix_diagnostic_sessions"
}

type DiagnosticTurn struct {
	ID                  uuid.UUID         `gorm:"type:uuid;primaryKey" json:"id"`
	DiagnosticSessionID uuid.UUID         `gorm:"type:uuid;not null;index" json:"diagnostic_session_id" yaml:"diagnostic_session_id"`
	DiagnosticSession   DiagnosticSession `gorm:"foreignKey:DiagnosticSessionID" json:"diagnostic_session,omitempty"`
	Question            string            `gorm:"type:text;not null" json:"question" yaml:"question"`
	UserAnswer          string            `gorm:"type:text" json:"user_answer" yaml:"user_answer"`
	TurnNumber          int               `json:"turn_number" yaml:"turn_number"`
	CreatedAt           time.Time         `json:"created_at" yaml:"created_at"`
}

func (DiagnosticTurn) TableName() string {
	return "techfix_diagnostic_turns"
}

func (d *DiagnosticTurn) BeforeCreate(tx *gorm.DB) error {
	if d.ID == uuid.Nil {
		d.ID = uuid.New()
	}
	return nil
}

type AIRecommendedProduct struct {
	ID                  uuid.UUID         `gorm:"type:uuid;primaryKey" json:"id"`
	DiagnosticSessionID uuid.UUID         `gorm:"type:uuid;not null;index" json:"diagnostic_session_id" yaml:"diagnostic_session_id"`
	DiagnosticSession   DiagnosticSession `gorm:"foreignKey:DiagnosticSessionID" json:"diagnostic_session,omitempty"`
	ProductoID          *uuid.UUID        `gorm:"type:uuid;index" json:"producto_id" yaml:"producto_id"`
	Producto            *Producto         `gorm:"foreignKey:ProductoID" json:"producto,omitempty"`
	Name                string            `gorm:"size:255;not null" json:"name" yaml:"name"`
	Description         string            `gorm:"type:text" json:"description" yaml:"description"`
	Category            string            `gorm:"size:100" json:"category" yaml:"category"`
	EstimatedPrice      float64           `json:"estimated_price" yaml:"estimated_price"`
	AIReasoning         string            `gorm:"type:text" json:"ai_reasoning" yaml:"ai_reasoning"`
	CreatedAt           time.Time         `json:"created_at" yaml:"created_at"`
}

func (AIRecommendedProduct) TableName() string {
	return "techfix_ai_recommended_products"
}

func (a *AIRecommendedProduct) BeforeCreate(tx *gorm.DB) error {
	if a.ID == uuid.Nil {
		a.ID = uuid.New()
	}
	return nil
}
