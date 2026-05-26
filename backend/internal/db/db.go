package db

import (
	"fmt"
	"log"
	"os"

	"backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Error al conectar a la base de datos:", err)
	}

	// AutoMigrate de todos los modelos
	err = database.AutoMigrate(
		&models.Usuario{},
		&models.Equipo{},
		&models.Producto{},
		&models.Proveedor{},
		&models.PedidoRepuesto{},
		&models.Transaccion{},
		&models.NodoGuia{},
		&models.SesionGuia{},
		&models.OrdenReparacion{},
		&models.Seguimiento{},
		&models.Garantia{},
	)
	if err != nil {
		log.Fatal("Error al migrar modelos:", err)
	}

	DB = database
	fmt.Println("Conexión a base de datos exitosa y modelos migrados.")
}
