-- Arreglar la migración de usuarios
-- Este script actualiza los valores NULL en password_hash

-- 1. Primero, hacer que la columna sea nullable temporalmente si no lo es
ALTER TABLE usuarios ALTER COLUMN password_hash DROP NOT NULL;

-- 2. Actualizar los valores NULL con un hash por defecto
UPDATE usuarios SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36SGLg06'
WHERE password_hash IS NULL;

-- 3. Ahora hacer que sea NOT NULL nuevamente
ALTER TABLE usuarios ALTER COLUMN password_hash SET NOT NULL;

-- Verificar que funcionó
SELECT COUNT(*) as registros_sin_password FROM usuarios WHERE password_hash IS NULL;
