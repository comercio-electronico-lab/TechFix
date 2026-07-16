package services

import "testing"

func TestNewDevicesService_CargaCatalogoReal(t *testing.T) {
	svc := NewDevicesService()

	devices := svc.GetAllDevices()
	if len(devices) == 0 {
		t.Fatalf("esperaba que el catálogo cargara al menos un tipo de dispositivo, obtuve 0 (¿falló la carga del YAML?)")
	}
	if _, ok := devices["smartphones"]; !ok {
		t.Fatalf("esperaba encontrar 'smartphones' en el catálogo, obtuve: %v", devices)
	}
}

func TestGetDevicesByType_TipoConocido(t *testing.T) {
	svc := NewDevicesService()

	result, err := svc.GetDevicesByType("smartphones")
	if err != nil {
		t.Fatalf("error inesperado: %v", err)
	}

	data, ok := result.(map[string]interface{})
	if !ok {
		t.Fatalf("esperaba un map, obtuve %T", result)
	}
	if data["category"] != "Smartphone" {
		t.Fatalf("esperaba category=Smartphone, obtuve %v", data["category"])
	}
}

func TestGetDevicesByType_TipoDesconocidoFalla(t *testing.T) {
	svc := NewDevicesService()

	if _, err := svc.GetDevicesByType("dron_submarino"); err == nil {
		t.Fatalf("esperaba error para un tipo de dispositivo inexistente")
	}
}

func TestGetBrands_IncluyeMarcaConocida(t *testing.T) {
	svc := NewDevicesService()

	brands, err := svc.GetBrands("smartphones")
	if err != nil {
		t.Fatalf("error inesperado: %v", err)
	}

	found := false
	for _, b := range brands {
		if b["key"] == "apple" && b["name"] == "Apple" {
			found = true
			break
		}
	}
	if !found {
		t.Fatalf("esperaba encontrar la marca 'apple' en %v", brands)
	}
}

func TestGetModels_MarcaConocidaDevuelveModelos(t *testing.T) {
	svc := NewDevicesService()

	models, err := svc.GetModels("smartphones", "apple")
	if err != nil {
		t.Fatalf("error inesperado: %v", err)
	}
	if len(models) == 0 {
		t.Fatalf("esperaba al menos un modelo para apple, obtuve 0")
	}

	found := false
	for _, m := range models {
		if m == "iPhone 15 Pro Max" {
			found = true
			break
		}
	}
	if !found {
		t.Fatalf("esperaba encontrar 'iPhone 15 Pro Max' en %v", models)
	}
}

func TestGetModels_MarcaDesconocidaFalla(t *testing.T) {
	svc := NewDevicesService()

	if _, err := svc.GetModels("smartphones", "marca_inexistente"); err == nil {
		t.Fatalf("esperaba error para una marca inexistente")
	}
}

func TestGetCategoryForDeviceType_TipoConocido(t *testing.T) {
	svc := NewDevicesService()

	category, err := svc.GetCategoryForDeviceType("smartphones")
	if err != nil {
		t.Fatalf("error inesperado: %v", err)
	}
	if category != "Smartphone" {
		t.Fatalf("esperaba category=Smartphone, obtuve %q", category)
	}
}
