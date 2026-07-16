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

	testDB, err := gorm.Open(sqlite.Open("file::memory:?cache=shared&_pragma=busy_timeout(5000)"), &gorm.Config{})
	if err != nil {
		t.Fatalf("no se pudo abrir la base de datos de pruebas: %v", err)
	}

	err = testDB.AutoMigrate(
		&models.Usuario{},
		&models.Producto{},
		&models.Payment{},
		&models.Pedido{},
		&models.PedidoProducto{},
		&models.Device{},
		&models.RepairOrder{},
		&models.RepairTracking{},
		&models.DiagnosticSession{},
		&models.DiagnosticTurn{},
		&models.AIRecommendedProduct{},
	)
	if err != nil {
		t.Fatalf("no se pudo migrar la base de datos de pruebas: %v", err)
	}

	sqlDB, err := testDB.DB()
	if err != nil {
		t.Fatalf("no se pudo obtener el *sql.DB subyacente: %v", err)
	}
	// SQLite no soporta escritores concurrentes reales (a diferencia de Postgres en
	// producción); forzar una única conexión serializa las transacciones a nivel del
	// pool de Go en lugar de que SQLite las rechace con "database is locked".
	sqlDB.SetMaxOpenConns(1)

	db.DB = testDB

	t.Cleanup(func() {
		sqlDB.Close()
	})

	return testDB
}
