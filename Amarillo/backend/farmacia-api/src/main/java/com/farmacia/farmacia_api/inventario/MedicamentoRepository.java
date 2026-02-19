package com.farmacia.farmacia_api.inventario;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicamentoRepository extends JpaRepository<Medicamento, String> {
    List<Medicamento> findByNombreContainingIgnoreCase(String nombre);
}
