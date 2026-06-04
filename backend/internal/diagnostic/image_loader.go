package diagnostic

import (
	"log"
	"math/rand"
	"os"
	"path/filepath"
	"strings"

	"gopkg.in/yaml.v3"
)

type ProductImageConfig struct {
	Category   string              `yaml:"category"`
	DeviceType string              `yaml:"device_type"`
	Components map[string][]ComponentImages `yaml:"components"`
}

type ComponentImages struct {
	Keywords []string `yaml:"keywords"`
	Images   []string `yaml:"images"`
}

var productImagesCache map[string]*ProductImageConfig

func init() {
	loadAllProductImages()
}

func loadAllProductImages() {
	productImagesCache = make(map[string]*ProductImageConfig)

	// Ruta de los YAMLs
	yamelsPath := "seeds/yamls"

	// Leer todos los archivos YAML en la carpeta
	files, err := os.ReadDir(yamelsPath)
	if err != nil {
		return
	}

	for _, file := range files {
		if !file.IsDir() && strings.HasSuffix(file.Name(), ".yaml") {
			filePath := filepath.Join(yamelsPath, file.Name())
			data, err := os.ReadFile(filePath)
			if err != nil {
				continue
			}

			config := &ProductImageConfig{}
			if err := yaml.Unmarshal(data, config); err != nil {
				continue
			}

			// Guardar con la categoría o device_type como clave
			key := strings.ToLower(config.Category)
			if key == "" {
				key = strings.ToLower(config.DeviceType)
			}
			productImagesCache[key] = config

		}
	}

}

// GetImageURLForProduct busca una URL de imagen apropiada para un producto
// deviceType: "smartphone", "laptop", "tablet", etc.
// productName: nombre del producto a buscar imagen
func GetImageURLForProduct(deviceType, productName string) string {
	if len(productImagesCache) == 0 {
		return ""
	}

	deviceKey := strings.ToLower(strings.TrimSpace(deviceType))
	productNameLower := strings.ToLower(productName)

	// Intentar obtener configuración específica del dispositivo
	config, ok := productImagesCache[deviceKey]
	if !ok {
		// Fallback a genérico
		config, ok = productImagesCache["generic"]
		if !ok {
			return ""
		}
	}

	// Buscar coincidencia de keywords en los componentes
	for _, componentList := range config.Components {
		for _, component := range componentList {
			for _, keyword := range component.Keywords {
				if strings.Contains(productNameLower, strings.ToLower(keyword)) {
					return getRandomImage(component.Images)
				}
			}
		}
	}

	// Fallback a primer componente si no hay coincidencia
	for _, componentList := range config.Components {
		for _, component := range componentList {
			if len(component.Images) > 0 {
				return getRandomImage(component.Images)
			}
		}
	}

	return ""
}

func getRandomImage(images []string) string {
	if len(images) == 0 {
		return ""
	}
	return images[rand.Intn(len(images))]
}
