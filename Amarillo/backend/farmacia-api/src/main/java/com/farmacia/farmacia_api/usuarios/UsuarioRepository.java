package com.farmacia.farmacia_api.usuarios;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    // Método mágico de JPA para buscar por nombre_usuario
    Optional<Usuario> findByNombreUsuario(String nombreUsuario);
}