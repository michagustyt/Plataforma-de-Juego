-- ============================================================
-- Migración: jugadores.id VARCHAR(36) → compatible con usuarios.id INT
-- Ejecutar UNA SOLA VEZ en phpMyAdmin o consola MySQL
-- ============================================================

-- Limpiar registros huérfanos (ids que no corresponden a ningún usuario)
-- Si prefieres conservarlos, comenta esta línea
DELETE FROM jugadores WHERE id NOT REGEXP '^[0-9]+$';

-- Convertir columna id a INT para FK real (opcional pero recomendado)
ALTER TABLE jugadores MODIFY COLUMN id INT NOT NULL;

-- Agregar clave foránea con usuarios (opcional, eliminar si da error de FK)
ALTER TABLE jugadores
    ADD CONSTRAINT fk_jugador_usuario
    FOREIGN KEY (id) REFERENCES usuarios(id)
    ON DELETE CASCADE ON UPDATE CASCADE;
