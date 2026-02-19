package com.farmacia.farmacia_api.despacho;

import com.farmacia.farmacia_api.inventario.Medicamento;
import com.farmacia.farmacia_api.inventario.MedicamentoRepository;
import com.farmacia.farmacia_api.usuarios.Usuario;
import com.farmacia.farmacia_api.usuarios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/movimientos")
public class MovimientoController {

    @Autowired private MovimientoRepository movimientoRepository;
    @Autowired private UsuarioRepository usuarioRepository;
    @Autowired private MedicamentoRepository medicamentoRepository;

    // 1. ENDPOINT PRINCIPAL (HISTORIAL PAGINADO)
    @GetMapping
    public Page<MovimientoDTO> obtenerHistorial(
            @RequestParam Integer usuarioId,
            @RequestParam String rol,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Movimiento> paginaMovimientos;

        if ("FARMACEUTICO".equalsIgnoreCase(rol)) {
            paginaMovimientos = movimientoRepository.findAllByOrderByFechaHoraDesc(pageable);
        } else {
            paginaMovimientos = movimientoRepository.findByUsuarioIdOrderByFechaHoraDesc(usuarioId, pageable);
        }

        return paginaMovimientos.map(this::convertirADTO);
    }

    // 2. ENDPOINT: DETALLE DE TRANSACCIÓN (PARA EL MODAL)
    @GetMapping("/detalle/{transaccionId}")
    public List<MovimientoDTO> obtenerDetalleTransaccion(@PathVariable String transaccionId) {
        if (transaccionId == null || "null".equals(transaccionId)) {
            return List.of();
        }

        return movimientoRepository.findByTransaccionId(transaccionId)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // 3. MÉTODO AUXILIAR (Limpio y directo)
    private MovimientoDTO convertirADTO(Movimiento mov) {
        Usuario user = usuarioRepository.findById(mov.getUsuarioId()).orElse(null);
        String nombreUser = (user != null) ? user.getNombreCompleto() : "Desconocido";
        String rolUser = (user != null) ? user.getRol() : "N/A";

        String codigoMed = mov.getLote().getMedicamentoCodigo();
        String nombreMed = medicamentoRepository.findById(codigoMed)
                .map(Medicamento::getNombre)
                .orElse("Desconocido");

        // ✅ AHORA SIMPLEMENTE PASAMOS EL TIPO TAL COMO VIENE DE LA BD
        // Ya no necesitamos hacer if/else porque MovimientoFactory lo guarda limpio.
        return new MovimientoDTO(
                mov.getId(),
                codigoMed,
                nombreMed,
                nombreUser,
                rolUser,
                mov.getCantidad(),
                mov.getTipo(), // Aquí pasamos el tipo directamente
                mov.getFechaHora(),
                mov.getLote().getNumeroLote(),
                mov.getCantidadReembolsada(),
                mov.getTransaccionId()
        );
    }
}