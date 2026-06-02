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
	Rol          string    `gorm:"size:20;default:'Cliente'" json:"rol" yaml:"rol"`
	Estado       string    `gorm:"size:20;default:'Activo'" json:"estado" yaml:"estado"`
	JoinedDate   time.Time `json:"joined_date" yaml:"joined_date"`
	PasswordHash string    `gorm:"size:255;not null" json:"-"`
}

func (Usuario) TableName() string {
	return "usuarios"
}

type Device struct {
	Base
	UserID       uuid.UUID  `gorm:"type:uuid;not null" json:"user_id" yaml:"user_id"`
	User         Usuario    `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Brand        string     `gorm:"size:80;not null" json:"brand" yaml:"brand"`
	Model        string     `gorm:"size:120;not null" json:"model" yaml:"model"`
	SerialNumber string     `gorm:"size:100;uniqueIndex;not null" json:"serial_number" yaml:"serial_number"`
	DeviceType   string     `gorm:"size:20;not null" json:"device_type" yaml:"device_type"`
	PurchaseDate *time.Time `json:"purchase_date" yaml:"purchase_date"`
	Specs        string     `gorm:"size:255" json:"specs" yaml:"specs"`
	Status       string     `gorm:"size:40;default:'Active Warranty'" json:"status" yaml:"status"`
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
	RepairID    *uuid.UUID   `gorm:"type:uuid" json:"repair_id,omitempty" yaml:"repair_id"`
	RepairOrder *RepairOrder `gorm:"foreignKey:RepairID" json:"repair_order,omitempty"`
	UsuarioID   *uuid.UUID   `gorm:"type:uuid" json:"usuario_id,omitempty" yaml:"usuario_id"`
	Usuario     *Usuario     `gorm:"foreignKey:UsuarioID" json:"usuario,omitempty"`
	Monto       float64      `json:"monto" yaml:"monto"`
	Metodo      string       `json:"metodo" yaml:"metodo"`
	Estado      string       `json:"estado" yaml:"estado"`
	Referencia  string       `json:"referencia" yaml:"referencia"`
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
	UserID               *uuid.UUID `gorm:"type:uuid" json:"user_id,omitempty" yaml:"user_id"`
	User                 *Usuario   `gorm:"foreignKey:UserID" json:"user,omitempty"`
	DeviceID             *uuid.UUID `gorm:"type:uuid" json:"device_id,omitempty" yaml:"device_id"`
	Device               *Device    `gorm:"foreignKey:DeviceID" json:"device,omitempty"`
	SymptomPath          []byte     `gorm:"type:jsonb" json:"symptom_path" yaml:"symptom_path"`
	PreliminaryDiagnosis string     `gorm:"size:255" json:"preliminary_diagnosis" yaml:"preliminary_diagnosis"`
	EstimatedPriceMin    float64    `json:"estimated_price_min" yaml:"estimated_price_min"`
	EstimatedPriceMax    float64    `json:"estimated_price_max" yaml:"estimated_price_max"`
	ConvertedToOrder     bool       `gorm:"default:false" json:"converted_to_order" yaml:"converted_to_order"`
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
	DiagnosisFinal string   `gorm:"type:text" json:"diagnosis_final" yaml:"diagnosis_final"`
	FinalPrice   float64    `json:"final_price" yaml:"final_price"`
	Notes        string     `gorm:"type:text" json:"notes" yaml:"notes"`
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
