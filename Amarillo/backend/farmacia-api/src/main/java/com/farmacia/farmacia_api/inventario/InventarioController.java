package com.farmacia.farmacia_api.inventario;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    @Autowired
    private InventarioService inventarioService;
    @Autowired private MarcaRepository marcaRepository;
    @Autowired private LineaRepository lineaRepository;
    @Autowired private PresentacionRepository presentacionRepository;

    // --- ENDPOINTS EXISTENTES ---

    @GetMapping
    public List<InventarioLoteDTO> obtenerInventario(@RequestParam String rol) {

        boolean incluirVencidos = "FARMACEUTICO".equalsIgnoreCase(rol);

        return inventarioService.obtenerInventarioPorLote(incluirVencidos);
    }


    // --- NUEVOS ENDPOINTS (RECEPCIÓN INTELIGENTE) ---

    // 1. ENDPOINT DE BÚSQUEDA (Para el Autocomplete)
    // Ejemplo de uso: GET /api/inventario/buscar?q=parace
    @GetMapping("/buscar")
    public List<Medicamento> buscarMedicamentos(@RequestParam String q) {
        return inventarioService.buscarPorNombre(q);
    }

    // 2. ENDPOINT DE GUARDADO (Crear o Actualizar Lote y Medicamento)
    // Ejemplo de uso: POST /api/inventario/entrada
    @PostMapping("/entrada")
    public ResponseEntity<?> recibirMercancia(@RequestBody RecepcionDTO recepcionDTO) {
        try {
            // Llama al servicio inteligente que creamos antes
            Medicamento med = inventarioService.registrarEntrada(recepcionDTO);
            return ResponseEntity.ok(med);
        } catch (Exception e) {
            e.printStackTrace(); // Para ver el error en consola de Java si falla
            return ResponseEntity.badRequest().body("Error al procesar la entrada: " + e.getMessage());
        }
    }

    @GetMapping("/marcas")
    public List<Marca> obtenerMarcas() {
        return marcaRepository.findAll();
    }

    @GetMapping("/lineas")
    public List<Linea> obtenerLineas() {
        return lineaRepository.findAll();
    }

    @GetMapping("/presentaciones")
    public List<Presentacion> obtenerPresentaciones() {
        return presentacionRepository.findAll();
    }
}