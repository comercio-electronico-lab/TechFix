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
