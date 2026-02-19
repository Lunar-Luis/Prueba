-- ==========================================
-- 1. CATÁLOGOS PRINCIPALES (Lineas, Marcas, Presentaciones)
-- ==========================================
INSERT IGNORE INTO lineas (id, nombre) VALUES 
(1, 'Analgésicos'),
(2, 'Antibióticos'),
(3, 'Cardiología');

INSERT IGNORE INTO marcas (id, nombre) VALUES 
(1, 'Genfar'),
(2, 'MK'),
(3, 'Bayer');

INSERT IGNORE INTO presentaciones (id, nombre) VALUES 
(1, 'Tableta'),
(2, 'Jarabe'),
(3, 'Inyectable');

-- ==========================================
-- 2. MEDICAMENTOS (3 Ejemplos Variados)
-- ==========================================
INSERT IGNORE INTO medicamentos (codigo, nombre, descripcion, concentracion, estado_catalogo, linea_id, marca_id, presentacion_id) VALUES 
('MED-001', 'Paracetamol', 'Alivia el dolor y baja la fiebre', '500mg', 'ACTIVO', 1, 1, 1),
('MED-002', 'Amoxicilina', 'Antibiótico de amplio espectro', '500mg', 'ACTIVO', 2, 2, 3),
('MED-003', 'Losartán', 'Para la presión arterial alta', '50mg', 'ACTIVO', 3, 3, 1);

-- ==========================================
-- 3. LOTES (Stock Inicial para pruebas)
-- ==========================================
INSERT IGNORE INTO lotes (id, numero_lote, medicamento_codigo, cantidad_actual, fecha_vencimiento, estado_sanitario, ubicacion, proveedor) VALUES 
(1, 'LOTE-A100', 'MED-001', 100, '2028-12-31', 'APROBADO', 'Estante A', 'Distribuidora Nacional'),
(2, 'LOTE-B200', 'MED-002', 50, '2027-06-30', 'APROBADO', 'Estante B', 'Laboratorios MK'),
(3, 'LOTE-C300', 'MED-003', 200, '2029-01-15', 'APROBADO', 'Estante A', 'Bayer S.A.');

-- ==========================================
-- 4. USUARIOS (1 Farmacéutico, 2 Auxiliares)
-- ==========================================
-- Nota: La contraseña '12345' asume que en tu entorno de pruebas no usas Hash complejo
-- Si usas BCrypt, reemplaza '12345' por el hash correspondiente.
INSERT IGNORE INTO usuarios (id, nombre_completo, nombre_usuario, email, contrasena, rol) VALUES 
(1, 'Jefe de Farmacia', 'farmaceutico1', 'jefe@hospital.com', '12345', 'FARMACEUTICO'),
(2, 'Auxiliar Pedro', 'auxiliar1', 'aux1@hospital.com', '12345', 'AUXILIAR'),
(3, 'Auxiliar María', 'auxiliar2', 'aux2@hospital.com', '12345', 'AUXILIAR');