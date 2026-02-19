package com.farmacia.farmacia_api.despacho;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimientoRepository extends JpaRepository<Movimiento, Integer> {

    // 1. Para el Farmacéutico (Paginado)
    Page<Movimiento> findAllByOrderByFechaHoraDesc(Pageable pageable);

    // 2. Para el Auxiliar (Paginado)
    Page<Movimiento> findByUsuarioIdOrderByFechaHoraDesc(Integer usuarioId, Pageable pageable);

    List<Movimiento> findByTransaccionId(String transaccionId);

}