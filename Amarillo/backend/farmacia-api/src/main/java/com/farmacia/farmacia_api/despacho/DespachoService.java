package com.farmacia.farmacia_api.despacho;

import com.farmacia.farmacia_api.lote.Lote;
import com.farmacia.farmacia_api.lote.LoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class DespachoService {

    @Autowired
    private LoteRepository loteRepository;

    @Autowired
    private MovimientoRepository movimientoRepository;

    // ✅ REFACTORIZADO: Ahora recibe el lote exacto y hace un descuento directo
    @Transactional
    public void procesarDespacho(String numeroLote, int cantidadSolicitada, Integer idUsuarioAuxiliar, String transaccionId) {

        // 1. Buscar EL LOTE EXACTO que el auxiliar seleccionó en pantalla
        Lote lote = loteRepository.findByNumeroLote(numeroLote)
                .orElseThrow(() -> new RuntimeException("Lote no encontrado: " + numeroLote));

        // 2. Validar que no esté vencido (Seguridad del paciente)
        if (lote.getFechaVencimiento().isBefore(LocalDate.now())) {
            throw new RuntimeException("ERROR ALERTA: No se puede despachar el lote " + numeroLote + " porque está vencido.");
        }

        // 3. Validar que tenga suficiente stock físico
        if (lote.getCantidadActual() < cantidadSolicitada) {
            throw new RuntimeException("Stock insuficiente. El lote " + numeroLote + " solo tiene " + lote.getCantidadActual() + " unidades.");
        }

        // 4. Actualizar el Lote (Resta física exacta)
        lote.setCantidadActual(lote.getCantidadActual() - cantidadSolicitada);
        loteRepository.save(lote);

        // 5. Registrar Auditoría usando nuestra nueva Factory limpia
        Movimiento movimiento = MovimientoFactory.crearMovimiento("DESPACHO", cantidadSolicitada);
        movimiento.setLote(lote);
        movimiento.setUsuarioId(idUsuarioAuxiliar);
        movimiento.setTransaccionId(transaccionId);

        movimientoRepository.save(movimiento);
    }

    // ✅ REFACTORIZADO: Simplificado usando el diccionario estándar
    @Transactional
    public void procesarDevolucion(Integer movimientoOriginalId, int cantidadADevolver, Integer usuarioId) {

        Movimiento movOriginal = movimientoRepository.findById(movimientoOriginalId)
                .orElseThrow(() -> new RuntimeException("Movimiento no encontrado"));

        String tipo = movOriginal.getTipo().toUpperCase();

        // Ahora todo se llama "DESPACHO" en la BD, la validación es directa
        if (!tipo.equals("DESPACHO")) {
            throw new RuntimeException("Solo se pueden reembolsar movimientos de despacho.");
        }

        int yaDevuelto = movOriginal.getCantidadReembolsada();
        int totalOriginal = movOriginal.getCantidad();
        int disponibleParaDevolver = totalOriginal - yaDevuelto;

        if (cantidadADevolver <= 0) {
            throw new RuntimeException("La cantidad debe ser mayor a 0.");
        }
        if (disponibleParaDevolver == 0) {
            throw new RuntimeException("Este movimiento ya fue reembolsado totalmente.");
        }
        if (cantidadADevolver > disponibleParaDevolver) {
            throw new RuntimeException("Error: Solo quedan " + disponibleParaDevolver + " unidades disponibles para devolver.");
        }

        // Actualizar stock
        Lote lote = movOriginal.getLote();
        lote.setCantidadActual(lote.getCantidadActual() + cantidadADevolver);
        loteRepository.save(lote);

        // Actualizar contador original
        movOriginal.setCantidadReembolsada(yaDevuelto + cantidadADevolver);
        movimientoRepository.save(movOriginal);

        // Registrar movimiento de DEVOLUCION usando la Factory
        Movimiento devolucion = MovimientoFactory.crearMovimiento("DEVOLUCION", cantidadADevolver);
        devolucion.setLote(lote);
        devolucion.setUsuarioId(usuarioId);

        movimientoRepository.save(devolucion);
    }

    // ✅ NUEVO: Procesamiento para dar de baja medicamentos (Mermas)
    @Transactional
    public void procesarMerma(DespachoController.MermaDTO dto) {
        // Buscar el lote exacto
        Lote lote = loteRepository.findByMedicamentoCodigoAndNumeroLote(dto.codigoMedicamento, dto.numeroLote)
                .orElseThrow(() -> new RuntimeException("Lote no encontrado"));

        // Validar cantidad
        if (dto.cantidad <= 0 || dto.cantidad > lote.getCantidadActual()) {
            throw new RuntimeException("Cantidad inválida para dar de baja.");
        }

        // Restar del lote
        lote.setCantidadActual(lote.getCantidadActual() - dto.cantidad);
        loteRepository.save(lote);

        // Registrar Movimiento de "BAJA" usando la Factory
        Movimiento merma = MovimientoFactory.crearMovimiento("BAJA", dto.cantidad);
        merma.setLote(lote);
        merma.setUsuarioId(dto.usuarioId);
        merma.setTransaccionId("MOTIVO: " + dto.motivo);

        movimientoRepository.save(merma);
    }
}