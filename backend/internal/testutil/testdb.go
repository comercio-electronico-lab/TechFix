package testutil

import (
	"testing"

	"backend/internal/db"
	"backend/internal/models"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

// SetupTestDB abre una base de datos SQLite en memoria, corre las migraciones
// necesarias y la deja asignada como db.DB para que los handlers (que usan
// la variable de paquete directamente) operen contra ella durante el test.
func SetupTestDB(t *testing.T) *gorm.DB {
	t.Helper()

	testDB, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		t.Fatalf("no se pudo abrir la base de datos de pruebas: %v", err)
	}

	err = testDB.AutoMigrate(
		&models.Usuario{},
		&models.Producto{},
		&models.Payment{},
		&models.Pedido{},
		&models.PedidoProducto{},
	)
	if err != nil {
		t.Fatalf("no se pudo migrar la base de datos de pruebas: %v", err)
	}

	db.DB = testDB

	t.Cleanup(func() {
		sqlDB, err := testDB.DB()
		if err == nil {
			sqlDB.Close()
		}
	})

	return testDB
}
