package com.farmacia.farmacia_api.inventario;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LineaRepository extends JpaRepository<Linea, Long> {
    Optional<Linea> findByNombre(String nombre);
}