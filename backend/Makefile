# Variables
MAIN_PATH=./cmd/api/main.go
BINARY_NAME=api-server
BUILD_DIR=./bin

ifneq ("$(wildcard .env)","")
	include .env
	export $(shell sed 's/=.*//' .env)
endif

.PHONY: install dev migrate-up migrate-down seed build clean help

## install: Descarga e instala las dependencias del proyecto
install:
	@go mod download
	@go mod tidy
	@echo "Dependencias instaladas correctamente"

## dev: Inicia el servidor en modo desarrollo
dev:
	@go run $(MAIN_PATH)

## migrate-up: Ejecuta las migraciones automáticas
migrate-up:
	@go run $(MAIN_PATH) --migrate

## migrate-down: Revierte todas las migraciones
migrate-down:
	@go run $(MAIN_PATH) --migrate-down

## seed: Inserta datos iniciales
seed:
	@go run $(MAIN_PATH) --seed

## build: Compila el binario del proyecto
build:
	@mkdir -p $(BUILD_DIR)
	@go build -o $(BUILD_DIR)/$(BINARY_NAME) $(MAIN_PATH)
	@echo "Go compiló con éxito"

## clean: Elimina binarios y archivos temporales
clean:
	@echo "Limpiando..."
	@rm -rf $(BUILD_DIR)

## help: Muestra ayuda
help:
	@echo "Uso: make [target]"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
