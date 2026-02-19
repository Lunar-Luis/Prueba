package com.farmacia.farmacia_api.despacho;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/despachos")
public class DespachoController {

    @Autowired
    private DespachoService despachoService;

    // 1. ENDPOINT: Despacho Masivo (Salida)
    @PostMapping("/batch")
    public ResponseEntity<?> despacharLote(@RequestBody DespachoBatchDTO payload) {
        try {
            String transaccionId = UUID.randomUUID().toString();

            for (DespachoBatchDTO.ItemDespacho item : payload.items) {
                despachoService.procesarDespacho(
                        item.numeroLote,
                        item.cantidad,
                        payload.usuarioId,
                        transaccionId
                );
            }
            return ResponseEntity.ok("Despacho masivo exitoso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. ENDPOINT: Devolución (Entrada por corrección)
    @PostMapping("/devolucion")
    public ResponseEntity<?> realizarDevolucion(@RequestBody DevolucionDTO dto) {
        try {
            despachoService.procesarDevolucion(dto.movimientoId, dto.cantidad, dto.usuarioId);
            return ResponseEntity.ok("Reembolso procesado exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 3. ✅ NUEVO ENDPOINT: Merma (Baja de Inventario)
    @PostMapping("/merma")
    public ResponseEntity<?> registrarMerma(@RequestBody MermaDTO dto) {
        try {
            despachoService.procesarMerma(dto);
            return ResponseEntity.ok("Baja procesada exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- DTOs INTERNOS ---

    public static class DevolucionDTO {
        public Integer movimientoId;
        public int cantidad;
        public Integer usuarioId;
    }

    // ✅ NUEVO DTO: Para recibir los datos de la Merma desde el Frontend
    public static class MermaDTO {
        public String codigoMedicamento;
        public String numeroLote;
        public int cantidad;
        public String motivo;
        public Integer usuarioId;
    }
}