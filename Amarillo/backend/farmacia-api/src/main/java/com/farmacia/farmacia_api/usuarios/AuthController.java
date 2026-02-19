package com.farmacia.farmacia_api.usuarios;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginRequest) {

        // 1. Buscar usuario en BD
        Optional<Usuario> usuarioOpt = usuarioRepository.findByNombreUsuario(loginRequest.getNombreUsuario());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            // 2. Verificar contraseña (TEXTO PLANO POR AHORA)
            // IMPORTANTE: En el futuro cambiaremos esto por BCrypt
            if (usuario.getContrasena().equals(loginRequest.getPassword())) {

                // 3. Login Exitoso: Preparamos la respuesta
                Map<String, Object> respuesta = new HashMap<>();
                respuesta.put("mensaje", "Login exitoso");
                respuesta.put("usuario", usuario.getNombreUsuario());
                respuesta.put("id", usuario.getId());
                respuesta.put("rol", usuario.getRol());
                respuesta.put("nombreCompleto", usuario.getNombreCompleto());
                respuesta.put("token", "token-simulado-12345"); // Token dummy para que el frontend no falle
                respuesta.put("email", usuario.getEmail()); // Devolvemos el email por si acaso

                return ResponseEntity.ok(respuesta);
            }
        }

        // 4. Si falla algo
        return ResponseEntity.status(401).body("Credenciales incorrectas");
    }
}