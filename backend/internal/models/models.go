package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Base contiene los campos comunes con UUID
type Base struct {
	ID        uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// BeforeCreate genera el UUID antes de insertar
func (b *Base) BeforeCreate(tx *gorm.DB) (err error) {
	if b.ID == uuid.Nil {
		b.ID = uuid.New()
	}
	return
}

// Usuario representa tanto a clientes como técnicos
type Usuario struct {
	Base
	Login      string `gorm:"size:60;not null" json:"login"`
	Nombre     string `gorm:"size:255;not null" json:"nombre"`
	Email      string `gorm:"size:100;uniqueIndex;not null" json:"email"`
	Rol        string `gorm:"size:20;default:'Cliente'" json:"rol"` // Admin, Técnico, Cliente
	Estado     string `gorm:"size:20;default:'Activo'" json:"estado"` // Activo, Inactivo
	JoinedDate time.Time `json:"joined_date"`
}

// Equipo es el dispositivo del usuario
type Equipo struct {
	Base
	UsuarioID uuid.UUID `gorm:"type:uuid" json:"usuario_id"`
	Usuario   Usuario   `gorm:"foreignKey:UsuarioID" json:"usuario,omitempty"`
	Marca     string    `gorm:"size:80;not null" json:"marca"`
	Modelo    string    `gorm:"size:120;not null" json:"modelo"`
	Serie     string    `gorm:"size:100;uniqueIndex;not null" json:"serie"`
	Tipo      string    `gorm:"size:20;not null" json:"tipo"` // laptop, phone, tablet, etc.
	FechaCompra *time.Time `json:"fecha_compra"`
}

// Producto representa repuestos o equipos en venta
type Producto struct {
	Base
	Nombre          string  `gorm:"size:255;not null" json:"nombre"`
	Descripcion     string  `gorm:"type:text" json:"descripcion"`
	SKU             string  `gorm:"size:100;uniqueIndex" json:"sku"`
	PrecioVenta     float64 `json:"precio_venta"`
	PrecioCosto     float64 `json:"precio_costo"`
	StockActual     int     `gorm:"default:0" json:"stock_actual"`
	StockMinimo     int     `gorm:"default:5" json:"stock_minimo"`
	Categoria       string  `gorm:"size:100" json:"categoria"`
	ImagenURL       string  `json:"imagen_url"`
	EstadoComercial string  `gorm:"size:50" json:"status"` // In Stock, New Arrival, etc.
}

	ImagenURL   string  `json:"imagen_url"`
}

// Proveedor de repuestos
type Proveedor struct {
	Base
	Nombre   string `gorm:"size:255;not null" json:"nombre"`
	Contacto string `gorm:"size:100" json:"contacto"`
	Telefono string `gorm:"size:20" json:"telefono"`
	Email    string `gorm:"size:100" json:"email"`
}

// PedidoRepuesto para cuando "no tenemos y pedimos"
type PedidoRepuesto struct {
	Base
	ProveedorID uuid.UUID `gorm:"type:uuid" json:"proveedor_id"`
	ProductoID  uuid.UUID `gorm:"type:uuid" json:"producto_id"`
	OrdenID     uuid.UUID `gorm:"type:uuid" json:"orden_id"` // Vinculado a la reparación que lo necesita
	Cantidad    int       `json:"cantidad"`
	Estado      string    `gorm:"size:30;default:'solicitado'" json:"estado"` // solicitado, en_camino, recibido
	FechaLlegada *time.Time `json:"fecha_llegada"`
}

// Transaccion para el checkout (pagos)
type Transaccion struct {
	Base
	OrdenID    uuid.UUID `gorm:"type:uuid" json:"orden_id"`
	UsuarioID  uuid.UUID `gorm:"type:uuid" json:"usuario_id"`
	Monto      float64   `json:"monto"`
	Metodo     string    `json:"metodo"` // tarjeta, transferencia, efectivo
	Estado     string    `json:"estado"` // completado, pendiente, fallido
	Referencia string    `json:"referencia"` // ID de pasarela de pago
}

// ... (El resto de modelos NodoGuia, SesionGuia, OrdenReparacion, Seguimiento y Garantia se mantienen)

// SesionGuia guarda el recorrido del usuario por la guía
type SesionGuia struct {
	Base
	UsuarioID   uuid.UUID `gorm:"type:uuid" json:"usuario_id"`
	EquipoID    *uuid.UUID `gorm:"type:uuid" json:"equipo_id"`
	Ruta        string    `gorm:"type:text" json:"ruta"`
	Diagnostico string    `json:"diagnostico"`
	PrecioMin   float64   `json:"precio_min"`
	PrecioMax   float64   `json:"precio_max"`
	Convertido  bool      `gorm:"default:false" json:"convertido"`
}

// OrdenReparacion es el núcleo del sistema
type OrdenReparacion struct {
	Base
	UsuarioID uuid.UUID      `gorm:"type:uuid" json:"usuario_id"`
	EquipoID  uuid.UUID      `gorm:"type:uuid" json:"equipo_id"`
	SesionID  *uuid.UUID     `gorm:"type:uuid" json:"sesion_id"`
	TecnicoID *uuid.UUID     `gorm:"type:uuid" json:"tecnico_id"`
	Cita      time.Time      `json:"cita"`
	Estado    string         `gorm:"size:30;default:'pendiente'" json:"estado"`
	Detalle   string         `gorm:"type:text" json:"detalle"`
	Precio    float64        `json:"precio"`
	Notas     string         `gorm:"type:text" json:"notas"`
}

// Seguimiento registra el historial de cambios de estado
type Seguimiento struct {
	Base
	OrdenID       uuid.UUID `gorm:"type:uuid" json:"orden_id"`
	EstadoPrevio  string    `json:"estado_previo"`
	EstadoNuevo   string    `json:"estado_nuevo"`
	ResponsableID uuid.UUID `gorm:"type:uuid" json:"responsable_id"`
	Notas         string    `json:"notas"`
	Notificado    bool      `json:"notificado"`
}

// Garantia gestiona los tiempos de cobertura post-reparación
type Garantia struct {
	Base
	OrdenID   uuid.UUID `gorm:"type:uuid" json:"orden_id"`
	UsuarioID uuid.UUID `gorm:"type:uuid" json:"usuario_id"`
	EquipoID  uuid.UUID `gorm:"type:uuid" json:"equipo_id"`
	Dias      int       `gorm:"default:30" json:"dias"`
	Inicio    time.Time `json:"inicio"`
	Fin       time.Time `json:"fin"`
	Activa    bool      `gorm:"default:true" json:"activa"`
	Token     string    `gorm:"size:64;uniqueIndex" json:"token"`
}
