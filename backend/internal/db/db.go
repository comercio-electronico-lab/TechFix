package db

import (
	"fmt"
	"log"
	"os"

	"backend/internal/models"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No se pudo cargar el archivo .env, usando variables de entorno del sistema")
	}

	fmt.Println("Conectando a PostgreSQL...")
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Error al conectar a la base de datos PostgreSQL:", err)
	}

	DB = database
	fmt.Println("Conexión a base de datos PostgreSQL exitosa.")
}

func Migrate() {
	if DB == nil {
		log.Fatal("DB no conectada")
	}
	fmt.Println("Ejecutando AutoMigrate...")
	err := DB.AutoMigrate(
		&models.Usuario{},
		&models.Device{},
		&models.Producto{},
		&models.Proveedor{},
		&models.PigNode{},
		&models.PigNodeProducto{},
		&models.PigSession{},
		&models.PedidoRepuesto{},
		&models.RepairOrder{},
		&models.RepairOrderProducto{},
		&models.Transaccion{},
		&models.TransaccionProducto{},
		&models.RepairTracking{},
		&models.Warranty{},
		&models.Payment{},
		&models.Pedido{},
		&models.PedidoProducto{},
		&models.DiagnosticSession{},
		&models.DiagnosticTurn{},
		&models.AIRecommendedProduct{},
	)
	if err != nil {
		log.Fatal("Error en migración:", err)
	}
	fmt.Println("✓ Migración completada.")
}

func MigrateDown() {
	if DB == nil {
		log.Fatal("DB no conectada")
	}
	fmt.Println("Revirtiendo migraciones...")
	err := DB.Migrator().DropTable(
		&models.PigNodeProducto{},
		&models.RepairOrderProducto{},
		&models.TransaccionProducto{},
		&models.AIRecommendedProduct{},
		&models.DiagnosticTurn{},
		&models.DiagnosticSession{},
		&models.PedidoProducto{},
		&models.Pedido{},
		&models.Payment{},
		&models.Warranty{},
		&models.RepairTracking{},
		&models.RepairOrder{},
		&models.Transaccion{},
		&models.PedidoRepuesto{},
		&models.PigSession{},
		&models.PigNode{},
		&models.Proveedor{},
		&models.Device{},
		&models.Producto{},
		&models.Usuario{},
	)
	if err != nil {
		log.Fatal("Error al revertir migraciones:", err)
	}
	fmt.Println("Migraciones revertidas.")
}
