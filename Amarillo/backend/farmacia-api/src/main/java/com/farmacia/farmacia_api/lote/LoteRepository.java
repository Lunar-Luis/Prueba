package com.farmacia.farmacia_api.lote;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface LoteRepository extends JpaRepository<Lote, Integer> {

    // ✅ NUEVO: Métodos exactos para el nuevo DespachoService y Mermas
    Optional<Lote> findByNumeroLote(String numeroLote);

    Optional<Lote> findByMedicamentoCodigoAndNumeroLote(String medicamentoCodigo, String numeroLote);


    // ✅ CRÍTICO: Suma el stock de todos los lotes activos de un producto
    @Query("SELECT COALESCE(SUM(l.cantidadActual), 0) FROM Lote l WHERE l.medicamentoCodigo = :codigo AND l.estadoSanitario = 'DISPONIBLE'")
    Integer sumarStockDisponible(@Param("codigo") String codigo);


    // --- MÉTODOS QUE YA TENÍAS (Se mantienen para el InventarioService) ---

    Lote findFirstByMedicamentoCodigoAndEstadoSanitarioAndCantidadActualGreaterThanOrderByFechaVencimientoAsc(
            String codigo, String estado, int cantidadMinima
    );

    Optional<Lote> findFirstByMedicamentoCodigoAndEstadoSanitarioAndCantidadActualGreaterThanAndFechaVencimientoAfterOrderByFechaVencimientoAsc(
            String codigo,
            String estado,
            int cantidadMinima,
            LocalDate fechaHoy
    );

    List<Lote> findByMedicamentoCodigoAndEstadoSanitarioAndCantidadActualGreaterThanAndFechaVencimientoAfterOrderByFechaVencimientoAsc(
            String codigo, String estado, int cantidadMinima, LocalDate fechaActual
    );

    // AUXILIAR: solo lotes NO vencidos
    List<Lote> findByEstadoSanitarioAndCantidadActualGreaterThanAndFechaVencimientoAfter(
            String estadoSanitario,
            int cantidadMinima,
            LocalDate fecha
    );

    // FARMACÉUTICO: incluye vencidos
    List<Lote> findByEstadoSanitarioAndCantidadActualGreaterThan(
            String estadoSanitario,
            int cantidadMinima
    );
}