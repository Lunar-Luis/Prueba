-- ==========================================
-- 1. CATALOGOS PRINCIPALES
-- ==========================================
INSERT INTO lineas (id, nombre) VALUES 
(1, 'Analgesicos'),
(2, 'Antibioticos'),
(3, 'Cardiologia');

INSERT INTO marcas (id, nombre) VALUES 
(1, 'Genfar'),
(2, 'MK'),
(3, 'Bayer');

INSERT INTO presentaciones (id, nombre) VALUES 
(1, 'Tableta'),
(2, 'Jarabe'),
(3, 'Inyectable');

-- ==========================================
-- 2. MEDICAMENTOS
-- ==========================================
INSERT INTO medicamentos (codigo, nombre, descripcion, concentracion, estado_catalogo, linea_id, marca_id, presentacion_id) VALUES 
('MED-001', 'Paracetamol', 'Alivia el dolor y baja la fiebre', '500mg', 'ACTIVO', 1, 1, 1),
('MED-002', 'Amoxicilina', 'Antibiotico de amplio espectro', '500mg', 'ACTIVO', 2, 2, 3),
('MED-003', 'Losartan', 'Para la presion arterial', '50mg', 'ACTIVO', 3, 3, 1);

-- ==========================================
-- 3. LOTES
-- ==========================================
INSERT INTO lotes (id, numero_lote, medicamento_codigo, cantidad_actual, fecha_vencimiento, estado_sanitario, ubicacion, proveedor) VALUES 
(1, 'LOTE-A100', 'MED-001', 100, '2028-12-31', 'DISPONIBLE', 'Estante A', 'Distribuidora Nacional'),
(2, 'LOTE-B200', 'MED-002', 50, '2027-06-30', 'DISPONIBLE', 'Estante B', 'Laboratorios MK'),
(3, 'LOTE-C300', 'MED-003', 200, '2029-01-15', 'DISPONIBLE', 'Estante A', 'Bayer SA');

-- ==========================================
-- 4. USUARIOS
-- ==========================================
INSERT INTO usuarios (id, nombre_completo, nombre_usuario, email, contrasena, rol) VALUES 
(1, 'Jefe de Farmacia', 'farmaceutico1', 'jefe@hospital.com', '12345', 'FARMACEUTICO'),
(2, 'Auxiliar Pedro', 'auxiliar1', 'aux1@hospital.com', '12345', 'AUXILIAR'),
(3, 'Auxiliar Maria', 'auxiliar2', 'aux2@hospital.com', '12345', 'AUXILIAR');