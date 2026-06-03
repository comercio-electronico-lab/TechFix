package diagnostic

import (
	"log"
	"math/rand"
	"os"
	"strings"

	"gopkg.in/yaml.v3"
)

type ProductImageConfig struct {
	Products map[string][]CategoryImages `yaml:"products"`
}

type CategoryImages struct {
	Keywords []string `yaml:"keywords"`
	Images   []string `yaml:"images"`
}

var productImages *ProductImageConfig

func init() {
	loadProductImages()
}

func loadProductImages() {
	data, err := os.ReadFile("seeds/product_images.yaml")
	if err != nil {
		log.Printf("Warning: failed to load product images YAML: %v", err)
		return
	}

	productImages = &ProductImageConfig{}
	if err := yaml.Unmarshal(data, productImages); err != nil {
		log.Printf("Warning: failed to parse product images YAML: %v", err)
		return
	}

	log.Println("✓ Product images loaded successfully")
}

// GetImageURLForProduct busca una URL de imagen apropiada para un producto
func GetImageURLForProduct(productName string) string {
	if productImages == nil || len(productImages.Products) == 0 {
		return ""
	}

	productNameLower := strings.ToLower(productName)

	// Buscar coincidencia de keywords
	for _, categories := range productImages.Products {
		for _, category := range categories {
			for _, keyword := range category.Keywords {
				if strings.Contains(productNameLower, strings.ToLower(keyword)) {
					return getRandomImage(category.Images)
				}
			}
		}
	}

	// Fallback a genérico si no hay coincidencia
	if genericImages, ok := productImages.Products["generic"]; ok && len(genericImages) > 0 {
		return getRandomImage(genericImages[0].Images)
	}

	return ""
}

func getRandomImage(images []string) string {
	if len(images) == 0 {
		return ""
	}
	return images[rand.Intn(len(images))]
}
