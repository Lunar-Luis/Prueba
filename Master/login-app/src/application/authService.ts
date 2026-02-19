import { loginSchema, type LoginCredentials } from '../core/auth.schema';
import { loginApi } from '../infrastructure/api/auth';

export const loginUser = async (credentials: LoginCredentials) => {
  // 1. Validamos los datos usando el esquema de Zod.
  // Si los datos son inválidos, Zod lanzará un error que podemos capturar.
  const validatedCredentials = loginSchema.parse(credentials);

  // 2. Llamamos a la función de la API con los datos ya validados.
  try {
    const result = await loginApi(validatedCredentials);
    return result;
  } catch (error) {
    // Re-lanzamos el error para que la capa de UI pueda manejarlo.
    if (error instanceof Error) {
      throw new Error(error.message || 'Ocurrió un error inesperado.');
    }
    throw new Error('Ocurrió un error inesperado.');
  }
};