package com.farmacia.farmacia_api.dashboard;

import com.farmacia.farmacia_api.inventario.Medicamento;
import com.farmacia.farmacia_api.inventario.MedicamentoRepository;
import com.farmacia.farmacia_api.lote.Lote;
import com.farmacia.farmacia_api.lote.LoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DashboardService {

    @Autowired private MedicamentoRepository medRepo;
    @Autowired private LoteRepository loteRepo;

    public List<SupplyDTO> obtenerReporteInsumos() {
        List<Medicamento> medicamentos = medRepo.findAll();
        List<SupplyDTO> reporte = new ArrayList<>();

        for (Medicamento med : medicamentos) {
            // 1. OBTENER STOCK REAL (Usando el query nuevo)
            Integer stockTotal = loteRepo.sumarStockDisponible(med.getCodigo());

            // 2. OBTENER DATOS DEL LOTE MÁS PRÓXIMO A VENCER (Para sacar fecha y ubicación)
            // Usamos tu método existente que busca el primero disponible ordenado por fecha
            Optional<Lote> loteOpt = loteRepo.findFirstByMedicamentoCodigoAndEstadoSanitarioAndCantidadActualGreaterThanAndFechaVencimientoAfterOrderByFechaVencimientoAsc(
                    med.getCodigo(), "DISPONIBLE", 0, LocalDate.now()
            );

            // Si no hay lote (stock 0), enviamos null en fecha y "Sin Ubicación"
            LocalDate vencimiento = loteOpt.map(Lote::getFechaVencimiento).orElse(null);
            String area = loteOpt.map(Lote::getUbicacion).orElse("Sin Stock");

            // 3. OBTENER CATEGORÍA (De tu tabla Linea o Marca)
            String categoria = "Varios";
            if (med.getLinea() != null && med.getLinea().getNombre() != null) {
                categoria = med.getLinea().getNombre();
            } else if (med.getMarca() != null && med.getMarca().getNombre() != null) {
                categoria = med.getMarca().getNombre();
            }

            // 4. CREAR EL DTO
            reporte.add(new SupplyDTO(
                    med.getCodigo(),
                    med.getNombre(),
                    categoria,
                    area,
                    stockTotal,
                    vencimiento
            ));
        }
        return reporte;
    }
}