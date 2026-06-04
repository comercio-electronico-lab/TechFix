package services

import (
	"fmt"
	"log"
	"os"

	"gopkg.in/yaml.v3"
)

type DeviceCatalog struct {
	Devices           map[string]DeviceCategory `yaml:"devices"`
	DiagnosticConfig  map[string]interface{}    `yaml:"diagnostic_config"`
}

type DeviceCategory struct {
	Category string                `yaml:"category"`
	Brands   map[string]BrandInfo  `yaml:"brands"`
}

type BrandInfo struct {
	Name   string   `yaml:"name"`
	Models []string `yaml:"models"`
}

type DevicesService struct {
	catalog *DeviceCatalog
}

var devicesServiceInstance *DevicesService

func GetDevicesService() *DevicesService {
	if devicesServiceInstance == nil {
		devicesServiceInstance = NewDevicesService()
	}
	return devicesServiceInstance
}

func NewDevicesService() *DevicesService {
	catalog, err := loadDeviceCatalog()
	if err != nil {
		log.Printf("Warning: failed to load device catalog: %v", err)
		catalog = &DeviceCatalog{
			Devices: make(map[string]DeviceCategory),
		}
	}

	return &DevicesService{
		catalog: catalog,
	}
}

func loadDeviceCatalog() (*DeviceCatalog, error) {
	data, err := os.ReadFile("seeds/yamls/devices_catalog.yaml")
	if err != nil {
		return nil, fmt.Errorf("failed to read devices catalog: %w", err)
	}

	catalog := &DeviceCatalog{}
	if err := yaml.Unmarshal(data, catalog); err != nil {
		return nil, fmt.Errorf("failed to parse devices catalog: %w", err)
	}

	log.Println("✓ Device catalog loaded successfully")
	return catalog, nil
}

// GetAllDevices retorna todas las categorías de dispositivos disponibles
func (s *DevicesService) GetAllDevices() map[string]interface{} {
	result := make(map[string]interface{})

	for deviceType, category := range s.catalog.Devices {
		result[deviceType] = map[string]interface{}{
			"category": category.Category,
			"brands":   len(category.Brands),
		}
	}

	return result
}

// GetDevicesByType retorna marcas y modelos de un tipo de dispositivo
func (s *DevicesService) GetDevicesByType(deviceType string) (interface{}, error) {
	category, ok := s.catalog.Devices[deviceType]
	if !ok {
		return nil, fmt.Errorf("device type not found: %s", deviceType)
	}

	brands := make(map[string]interface{})
	for brandKey, brandInfo := range category.Brands {
		brands[brandKey] = map[string]interface{}{
			"name":   brandInfo.Name,
			"models": len(brandInfo.Models),
		}
	}

	return map[string]interface{}{
		"category": category.Category,
		"brands":   brands,
	}, nil
}

// GetBrands retorna todas las marcas de un tipo de dispositivo
func (s *DevicesService) GetBrands(deviceType string) ([]map[string]interface{}, error) {
	category, ok := s.catalog.Devices[deviceType]
	if !ok {
		return nil, fmt.Errorf("device type not found: %s", deviceType)
	}

	brands := []map[string]interface{}{}
	for key, brandInfo := range category.Brands {
		brands = append(brands, map[string]interface{}{
			"key":  key,
			"name": brandInfo.Name,
		})
	}

	return brands, nil
}

// GetModels retorna todos los modelos de una marca específica
func (s *DevicesService) GetModels(deviceType, brand string) ([]string, error) {
	category, ok := s.catalog.Devices[deviceType]
	if !ok {
		return nil, fmt.Errorf("device type not found: %s", deviceType)
	}

	brandInfo, ok := category.Brands[brand]
	if !ok {
		return nil, fmt.Errorf("brand not found: %s", brand)
	}

	return brandInfo.Models, nil
}

// GetCategoryForDeviceType retorna la categoría técnica (Smartphone, Laptop, etc.)
func (s *DevicesService) GetCategoryForDeviceType(deviceType string) (string, error) {
	category, ok := s.catalog.Devices[deviceType]
	if !ok {
		return "", fmt.Errorf("device type not found: %s", deviceType)
	}

	return category.Category, nil
}
