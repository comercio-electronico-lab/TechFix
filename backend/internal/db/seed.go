package db

import (
	"fmt"
	"log"
	"os"
	"time"

	"backend/internal/models"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/yaml.v3"
)

type DeviceSeedData struct {
	Dispositivos []map[string]interface{} `yaml:"dispositivos"`
}

type UserSeedItem struct {
	Login      string    `yaml:"login"`
	Nombre     string    `yaml:"nombre"`
	Email      string    `yaml:"email"`
	Rol        string    `yaml:"rol"`
	Estado     string    `yaml:"estado"`
	JoinedDate time.Time `yaml:"joined_date"`
	Password   string    `yaml:"password"`
}

type UserSeedData struct {
	Usuarios []UserSeedItem `yaml:"usuarios"`
}

type ProductoSeedData struct {
	Productos []models.Producto `yaml:"productos"`
}

type PigNodeSeedItem struct {
	Key                 string   `yaml:"key"`
	ParentKey           string   `yaml:"parent_key"`
	DeviceType          string   `yaml:"device_type"`
	QuestionText        string   `yaml:"question_text"`
	AnswerOption        string   `yaml:"answer_option"`
	PreliminaryResult   string   `yaml:"preliminary_result"`
	EstimatedMin        float64  `yaml:"estimated_min"`
	EstimatedMax        float64  `yaml:"estimated_max"`
	IsTerminal          bool     `yaml:"is_terminal"`
	RecommendedProducts []string `yaml:"recommended_products"`
}

type PigNodeSeedData struct {
	PigNodes []PigNodeSeedItem `yaml:"pig_nodes"`
}

func Seed() {
	if DB == nil {
		fmt.Println("No hay conexión a la base de datos para sembrar datos.")
		return
	}

	fmt.Println("Sembrando datos base...")

	seedPath := "internal/db/seeds"

	// Usuarios
	if err := loadUsers(seedPath + "/usuarios.yml"); err != nil {
		log.Printf("Advertencia: %v\n", err)
	}

	// Dispositivos (dinámicos, busca usuarios por email)
	if err := loadDevices(seedPath + "/dispositivos.yml"); err != nil {
		log.Printf("Advertencia: %v\n", err)
	}

	// Productos
	if err := loadProductos(seedPath + "/productos.yml"); err != nil {
		log.Printf("Advertencia: %v\n", err)
	}

	// Asistente de Diagnóstico (PIG)
	if err := loadPigNodes(seedPath + "/pig_nodes.yml"); err != nil {
		log.Printf("Advertencia: %v\n", err)
	}

	// Reparaciones y Garantías de prueba
	seedRepairAndWarranties()

	fmt.Println("✓ Siembra base completada.")
}

func loadUsers(filePath string) error {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("no se pudo leer usuarios: %w", err)
	}

	var seedData UserSeedData
	if err := yaml.Unmarshal(data, &seedData); err != nil {
		return fmt.Errorf("error parsing usuarios: %w", err)
	}

	for _, su := range seedData.Usuarios {
		// Encriptar contraseña
		pwd := su.Password
		if pwd == "" {
			pwd = "password123"
		}
		hash, err := bcrypt.GenerateFromPassword([]byte(pwd), bcrypt.DefaultCost)
		if err != nil {
			return fmt.Errorf("error al hashear password para %s: %w", su.Email, err)
		}

		u := models.Usuario{
			Login:        su.Login,
			Nombre:       su.Nombre,
			Email:        su.Email,
			Rol:          su.Rol,
			Estado:       su.Estado,
			JoinedDate:   su.JoinedDate,
			PasswordHash: string(hash),
		}

		// Buscar si ya existe por email
		var existing models.Usuario
		err = DB.Where("email = ?", u.Email).First(&existing).Error
		if err != nil {
			// No existe, crear
			if err := DB.Create(&u).Error; err != nil {
				return fmt.Errorf("error al crear usuario semilla %s: %w", u.Email, err)
			}
		}
	}
	fmt.Printf("✓ usuarios cargados\n")
	return nil
}

func loadDevices(filePath string) error {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("no se pudo leer dispositivos: %w", err)
	}

	var seedData DeviceSeedData
	if err := yaml.Unmarshal(data, &seedData); err != nil {
		return fmt.Errorf("error parsing dispositivos: %w", err)
	}

	for _, deviceData := range seedData.Dispositivos {
		device := models.Device{
			Brand:        deviceData["brand"].(string),
			Model:        deviceData["model"].(string),
			SerialNumber: deviceData["serial_number"].(string),
			DeviceType:   deviceData["device_type"].(string),
		}

		// Buscar usuario por email
		userEmail := deviceData["user_email"].(string)
		var user models.Usuario
		if err := DB.Where("email = ?", userEmail).First(&user).Error; err != nil {
			log.Printf("Usuario no encontrado: %s\n", userEmail)
			continue
		}
		device.UserID = user.ID

		DB.Where(models.Device{SerialNumber: device.SerialNumber}).FirstOrCreate(&device)
	}
	fmt.Printf("✓ dispositivos cargados\n")
	return nil
}

func loadProductos(filePath string) error {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("no se pudo leer productos: %w", err)
	}

	var seedData ProductoSeedData
	if err := yaml.Unmarshal(data, &seedData); err != nil {
		return fmt.Errorf("error parsing productos: %w", err)
	}

	for _, p := range seedData.Productos {
		DB.Where(models.Producto{SKU: p.SKU}).FirstOrCreate(&p)
	}
	fmt.Printf("✓ productos cargados\n")
	return nil
}

func loadPigNodes(filePath string) error {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("no se pudo leer pig_nodes: %w", err)
	}

	var seedData PigNodeSeedData
	if err := yaml.Unmarshal(data, &seedData); err != nil {
		return fmt.Errorf("error parsing pig_nodes: %w", err)
	}

	// Pre-generar un mapa estable de Key -> UUID
	keyToUUID := make(map[string]uuid.UUID)
	for _, item := range seedData.PigNodes {
		keyToUUID[item.Key] = uuid.New()
	}

	for _, item := range seedData.PigNodes {
		nodeID := keyToUUID[item.Key]

		var parentNodeID *uuid.UUID
		if item.ParentKey != "" {
			pID, ok := keyToUUID[item.ParentKey]
			if ok {
				parentNodeID = &pID
			}
		}

		node := models.PigNode{
			ID:                nodeID,
			ParentNodeID:      parentNodeID,
			DeviceType:        item.DeviceType,
			QuestionText:      item.QuestionText,
			AnswerOption:      item.AnswerOption,
			PreliminaryResult: item.PreliminaryResult,
			EstimatedMin:      item.EstimatedMin,
			EstimatedMax:      item.EstimatedMax,
			IsTerminal:        item.IsTerminal,
		}

		// Crear nodo
		if err := DB.FirstOrCreate(&node).Error; err != nil {
			log.Printf("Error al sembrar nodo %s: %v\n", item.Key, err)
			continue
		}

		// Si tiene productos recomendados, asociar a pig_node_producto
		if item.IsTerminal && len(item.RecommendedProducts) > 0 {
			for _, sku := range item.RecommendedProducts {
				var prod models.Producto
				if err := DB.Where("sku = ?", sku).First(&prod).Error; err == nil {
					link := models.PigNodeProducto{
						ID:         uuid.New(),
						PigNodeID:  node.ID,
						ProductoID: prod.ID,
						CreatedAt:  time.Now(),
					}
					DB.FirstOrCreate(&link)
				}
			}
		}
	}

	fmt.Printf("✓ nodos y recomendaciones PIG cargados\n")
	return nil
}

func seedRepairAndWarranties() {
	// Sembrar proveedores mayoristas
	suppliers := []models.Proveedor{
		{
			Nombre:   "Importaciones TechParts S.A.",
			Contacto: "José Miguel",
			Telefono: "+51 987 123 456",
			Email:    "ventas@techparts.com",
		},
		{
			Nombre:   "Mayorista OEM Mobile",
			Contacto: "Andrea Rojas",
			Telefono: "+51 999 888 777",
			Email:    "pedidos@oemmobile.com",
		},
	}
	for _, s := range suppliers {
		DB.Where(models.Proveedor{Nombre: s.Nombre}).FirstOrCreate(&s)
	}
	fmt.Printf("✓ proveedores mayoristas sembrados\n")

	var carlos models.Usuario
	if err := DB.Where("email = ?", "carlos@example.com").First(&carlos).Error; err != nil {
		log.Printf("Advertencia: No se encontró a Carlos Pérez para sembrar reparaciones.")
		return
	}

	// 1. iPhone 14 Pro
	var iphone models.Device
	if err := DB.Where("user_id = ? AND brand = ? AND model = ?", carlos.ID, "Apple", "iPhone 14 Pro").First(&iphone).Error; err == nil {
		var count int64
		DB.Model(&models.RepairOrder{}).Where("device_id = ?", iphone.ID).Count(&count)
		if count == 0 {
			order := models.RepairOrder{
				UserID:              carlos.ID,
				DeviceID:            iphone.ID,
				AppointmentDatetime: time.Now().AddDate(0, 0, -3),
				Status:              "repairing",
				Notes:               "Falla de puerto de carga parpadeante. Diagnóstico del PIG adjuntado.",
			}
			if err := DB.Create(&order).Error; err == nil {
				trackingLogs := []models.RepairTracking{
					{
						RepairID:       order.ID,
						PreviousStatus: "",
						NewStatus:      "pending",
						ChangedBy:      carlos.ID,
						Notes:          "Solicitud de asistencia técnica agendada en línea por el cliente.",
					},
					{
						RepairID:       order.ID,
						PreviousStatus: "pending",
						NewStatus:      "in_review",
						ChangedBy:      carlos.ID,
						Notes:          "Dispositivo recibido físicamente en el laboratorio central. Se inicia el diagnóstico microscópico en banco de trabajo.",
					},
					{
						RepairID:       order.ID,
						PreviousStatus: "in_review",
						NewStatus:      "waiting_parts",
						ChangedBy:      carlos.ID,
						Notes:          "Diagnóstico finalizado. Microchip OEM controlador U2 de carga eléctrica agotado temporalmente en stock local. Solicitando importación express.",
					},
					{
						RepairID:       order.ID,
						PreviousStatus: "waiting_parts",
						NewStatus:      "repairing",
						ChangedBy:      carlos.ID,
						Notes:          "Repuestos OEM arribados a laboratorio. El ingeniero a cargo inicia la microsoldadura SMD bajo microscopio estereoscópico.",
					},
				}
				for _, logItem := range trackingLogs {
					DB.Create(&logItem)
				}
			}
		}
	}

	// 2. Dell XPS 13
	var dell models.Device
	if err := DB.Where("user_id = ? AND brand = ? AND model = ?", carlos.ID, "Dell", "XPS 13").First(&dell).Error; err == nil {
		var count int64
		DB.Model(&models.RepairOrder{}).Where("device_id = ?", dell.ID).Count(&count)
		if count == 0 {
			order := models.RepairOrder{
				UserID:              carlos.ID,
				DeviceID:            dell.ID,
				AppointmentDatetime: time.Now().AddDate(0, 0, -15),
				Status:              "delivered",
				DiagnosisFinal:      "Reemplazo de batería de litio OEM de 56Wh degradada por vida útil.",
				FinalPrice:          89.99,
				Notes:               "Servicio concluido exitosamente y entregado a su titular en oficina principal.",
			}
			if err := DB.Create(&order).Error; err == nil {
				trackingLogs := []models.RepairTracking{
					{
						RepairID:       order.ID,
						PreviousStatus: "",
						NewStatus:      "pending",
						ChangedBy:      carlos.ID,
						Notes:          "Solicitud agendada vía web por el cliente.",
					},
					{
						RepairID:       order.ID,
						PreviousStatus: "pending",
						NewStatus:      "in_review",
						ChangedBy:      carlos.ID,
						Notes:          "Dispositivo ingresado físicamente a banco de pruebas.",
					},
					{
						RepairID:       order.ID,
						PreviousStatus: "in_review",
						NewStatus:      "repairing",
						ChangedBy:      carlos.ID,
						Notes:          "Extracción de batería inflada e instalación de acumulador original de celdas OEM.",
					},
					{
						RepairID:       order.ID,
						PreviousStatus: "repairing",
						NewStatus:      "ready",
						ChangedBy:      carlos.ID,
						Notes:          "Calibración de ciclos finalizada al 100%. Equipo listo para entrega.",
					},
					{
						RepairID:       order.ID,
						PreviousStatus: "ready",
						NewStatus:      "delivered",
						ChangedBy:      carlos.ID,
						Notes:          "Equipo retirado por su titular. Se emite certificado de garantía digital por 90 días.",
					},
				}
				for _, logItem := range trackingLogs {
					DB.Create(&logItem)
				}

				now := time.Now()
				warranty := models.Warranty{
					RepairID:      order.ID,
					UserID:        carlos.ID,
					DeviceID:      dell.ID,
					WarrantyDays:  90,
					StartDate:     now.AddDate(0, 0, -10),
					EndDate:       now.AddDate(0, 0, 80),
					IsActive:      true,
					WarrantyToken: "WARR-DELL-XPS-9821",
				}
				DB.Create(&warranty)
			}
		}
	}
	fmt.Printf("✓ reparaciones y garantías de prueba sembradas para Carlos Pérez\n")
}
