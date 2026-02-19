import type { LoginFormData, LoginResponse } from '../types/auth';
import { API_URL } from '../config/env'; // ✅ Importamos la variable global

export const loginRequest = async (
  data: LoginFormData
): Promise<LoginResponse & { id: number }> => {

  // ✅ Ahora usamos la API_URL centralizada
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nombreUsuario: data.nombre,
      password: data.password,
    }),
  });

  // 👇 El manejo de errores se mantiene intacto porque está excelente
  if (!response.ok) {
    let message = 'Error al iniciar sesión';

    try {
      const errorData = await response.json();
      message = errorData?.message || message;
    } catch {}

    throw {
      status: response.status, 
      message,
    };
  }

  const json = await response.json();

  return {
    token: json.token,
    rol: json.rol.toLowerCase(),
    nombre: json.nombreCompleto || json.usuario,
    id: json.id,
  };
};