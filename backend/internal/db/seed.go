package db

import (
	"fmt"
	"log"
	"os"

	"backend/internal/models"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/yaml.v3"
)

type DeviceSeedData struct {
	Dispositivos []map[string]interface{} `yaml:"dispositivos"`
}

type UserSeedData struct {
	Usuarios []models.Usuario `yaml:"usuarios"`
}

type ProductoSeedData struct {
	Productos []models.Producto `yaml:"productos"`
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

	// Cargar Nodos PIG (Cotización interactiva)
	if err := loadPigNodes(); err != nil {
		log.Printf("Advertencia PIG: %v\n", err)
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

	for _, u := range seedData.Usuarios {
		// Generar el hash de bcrypt de forma segura para la contraseña "123456"
		bytes, err := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
		if err != nil {
			return fmt.Errorf("error hashing password: %w", err)
		}
		hashedPassword := string(bytes)

		var dbUser models.Usuario
		err = DB.Where("email = ?", u.Email).First(&dbUser).Error
		if err != nil {
			// El usuario no existe, crearlo nuevo con el hash
			u.PasswordHash = hashedPassword
			if err := DB.Create(&u).Error; err != nil {
				return fmt.Errorf("error creating user seed: %w", err)
			}
		} else {
			// El usuario existe en la DB. Forzar la sincronización del hash con "123456"
			dbUser.PasswordHash = hashedPassword
			if err := DB.Save(&dbUser).Error; err != nil {
				return fmt.Errorf("error updating user seed password: %w", err)
			}
		}
	}
	fmt.Printf("✓ usuarios cargados y contraseñas forzadas a '123456' con éxito\n")
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

func loadPigNodes() error {
	var count int64
	DB.Model(&models.PigNode{}).Count(&count)
	if count > 0 {
		fmt.Println("✓ Nodos PIG ya existen en la base de datos.")
		return nil
	}

	fmt.Println("Sembrando nodos del árbol de decisión PIG...")

	// ==========================================
	// 💻 LAPTOP NODES
	// ==========================================
	rootLaptop := models.PigNode{
		DeviceType:   "Laptop",
		QuestionText: "¿El equipo enciende?",
	}
	DB.Create(&rootLaptop)

	laptopEnciendeSi := models.PigNode{
		ParentNodeID: &rootLaptop.ID,
		DeviceType:   "Laptop",
		AnswerOption: "Sí",
		QuestionText: "¿El sistema operativo carga correctamente?",
	}
	DB.Create(&laptopEnciendeSi)

	laptopEnciendeNo := models.PigNode{
		ParentNodeID: &rootLaptop.ID,
		DeviceType:   "Laptop",
		AnswerOption: "No",
		QuestionText: "¿Muestra alguna luz al conectar el cargador?",
	}
	DB.Create(&laptopEnciendeNo)

	laptopSoCargaSi := models.PigNode{
		ParentNodeID: &laptopEnciendeSi.ID,
		DeviceType:   "Laptop",
		AnswerOption: "Sí",
		QuestionText: "¿Qué problema experimentas principalmente?",
	}
	DB.Create(&laptopSoCargaSi)

	DB.Create(&models.PigNode{
		ParentNodeID:      &laptopSoCargaSi.ID,
		DeviceType:        "Laptop",
		AnswerOption:      "La batería dura muy poco tiempo",
		QuestionText:      "Diagnóstico preliminar listo",
		PreliminaryResult: "Falla de degradación de celda de batería. Se requiere cambio de batería interna.",
		EstimatedMin:      45,
		EstimatedMax:      95,
		IsTerminal:        true,
	})

	DB.Create(&models.PigNode{
		ParentNodeID:      &laptopSoCargaSi.ID,
		DeviceType:        "Laptop",
		AnswerOption:      "Se calienta demasiado y hace ruido el ventilador",
		QuestionText:      "Diagnóstico preliminar listo",
		PreliminaryResult: "Mantenimiento térmico general requerido. Limpieza interna de disipadores y cambio de pasta térmica de alto rendimiento.",
		EstimatedMin:      30,
		EstimatedMax:      65,
		IsTerminal:        true,
	})

	laptopSoCargaNo := models.PigNode{
		ParentNodeID: &laptopEnciendeSi.ID,
		DeviceType:   "Laptop",
		AnswerOption: "No (Pantalla azul o se traba)",
		QuestionText: "¿Muestra algún código de error en la pantalla?",
	}
	DB.Create(&laptopSoCargaNo)

	DB.Create(&models.PigNode{
		ParentNodeID:      &laptopSoCargaNo.ID,
		DeviceType:        "Laptop",
		AnswerOption:      "Sí, muestra letras o código de error",
		QuestionText:      "Diagnóstico preliminar listo",
		PreliminaryResult: "Corrupción del sistema operativo o sectores defectuosos en la unidad de almacenamiento HDD/SSD.",
		EstimatedMin:      40,
		EstimatedMax:      85,
		IsTerminal:        true,
	})

	DB.Create(&models.PigNode{
		ParentNodeID:      &laptopSoCargaNo.ID,
		DeviceType:        "Laptop",
		AnswerOption:      "No, se queda la pantalla negra",
		QuestionText:      "Diagnóstico preliminar listo",
		PreliminaryResult: "Falla de lectura de memoria RAM o soldadura defectuosa en el chip de video (GPU).",
		EstimatedMin:      60,
		EstimatedMax:      140,
		IsTerminal:        true,
	})

	DB.Create(&models.PigNode{
		ParentNodeID:      &laptopEnciendeNo.ID,
		DeviceType:        "Laptop",
		AnswerOption:      "Sí, muestra luces de carga",
		QuestionText:      "Diagnóstico preliminar listo",
		PreliminaryResult: "Falla física en la placa base (corto en línea secundaria) o bios corrupta.",
		EstimatedMin:      90,
		EstimatedMax:      190,
		IsTerminal:        true,
	})

	DB.Create(&models.PigNode{
		ParentNodeID:      &laptopEnciendeNo.ID,
		DeviceType:        "Laptop",
		AnswerOption:      "No, está completamente muerto",
		QuestionText:      "Diagnóstico preliminar listo",
		PreliminaryResult: "Falla en el puerto de alimentación (Pin de carga Jack) o cargador de corriente dañado.",
		EstimatedMin:      35,
		EstimatedMax:      75,
		IsTerminal:        true,
	})

	// ==========================================
	// 📱 SMARTPHONE NODES
	// ==========================================
	rootPhone := models.PigNode{
		DeviceType:   "Smartphone",
		QuestionText: "¿La pantalla muestra imagen?",
	}
	DB.Create(&rootPhone)

	phoneScreenSi := models.PigNode{
		ParentNodeID: &rootPhone.ID,
		DeviceType:   "Smartphone",
		AnswerOption: "Sí",
		QuestionText: "¿El táctil responde correctamente?",
	}
	DB.Create(&phoneScreenSi)

	phoneTouchSi := models.PigNode{
		ParentNodeID: &phoneScreenSi.ID,
		DeviceType:   "Smartphone",
		AnswerOption: "Sí",
		QuestionText: "¿Cuál es la falla principal?",
	}
	DB.Create(&phoneTouchSi)

	DB.Create(&models.PigNode{
		ParentNodeID:      &phoneTouchSi.ID,
		DeviceType:        "Smartphone",
		AnswerOption:      "Batería se agota rápido o se apaga solo",
		QuestionText:      "Diagnóstico preliminar listo",
		PreliminaryResult: "Degradación química de la batería. Se requiere reemplazo de batería homologada.",
		EstimatedMin:      25,
		EstimatedMax:      55,
		IsTerminal:        true,
	})

	DB.Create(&models.PigNode{
		ParentNodeID:      &phoneTouchSi.ID,
		DeviceType:        "Smartphone",
		AnswerOption:      "No carga o tiene falso contacto al conectar",
		QuestionText:      "Diagnóstico preliminar listo",
		PreliminaryResult: "Puerto de carga USB-C / Lightning dañado o sulfatado. Se requiere cambio de flex de carga.",
		EstimatedMin:      30,
		EstimatedMax:      60,
		IsTerminal:        true,
	})

	DB.Create(&models.PigNode{
		ParentNodeID:      &phoneScreenSi.ID,
		DeviceType:        "Smartphone",
		AnswerOption:      "No, el táctil no responde o se vuelve loco",
		QuestionText:      "Diagnóstico preliminar listo",
		PreliminaryResult: "Falla física en el digitalizador de pantalla. Requiere cambio de módulo de pantalla completo.",
		EstimatedMin:      50,
		EstimatedMax:      120,
		IsTerminal:        true,
	})

	DB.Create(&models.PigNode{
		ParentNodeID:      &rootPhone.ID,
		DeviceType:        "Smartphone",
		AnswerOption:      "No, la pantalla está completamente negra o rota",
		QuestionText:      "Diagnóstico preliminar listo",
		PreliminaryResult: "Módulo de pantalla Amoled/LCD dañado por golpe. Requiere reemplazo completo de pantalla.",
		EstimatedMin:      60,
		EstimatedMax:      150,
		IsTerminal:        true,
	})

	fmt.Println("✓ Nodos PIG sembrados correctamente.")
	return nil
}
