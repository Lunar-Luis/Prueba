package com.farmacia.farmacia_api.inventario;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PresentacionRepository extends JpaRepository<Presentacion, Long> {
    Optional<Presentacion> findByNombre(String nombre);
}
