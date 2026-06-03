-- Migration: Add product search optimization indexes
-- Improves performance of product searches and filters

-- Index para búsqueda por nombre (case-insensitive ILIKE)
CREATE INDEX IF NOT EXISTS idx_productos_nombre_lower ON productos (LOWER(nombre));

-- Index para búsqueda por SKU
CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos (sku);

-- Index para filtro por categoría
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos (categoria);

-- Index para filtro por estado comercial
CREATE INDEX IF NOT EXISTS idx_productos_estado ON productos (estado_comercial);

-- Index compuesto para búsquedas más eficientes
CREATE INDEX IF NOT EXISTS idx_productos_categoria_estado ON productos (categoria, estado_comercial);
