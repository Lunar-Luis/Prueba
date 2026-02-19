import type { LoginCredentials } from '../../core/auth.schema';

// Simulación de una base de datos de usuarios
const MOCK_USER = {
  email: 'medico@hospital.com',
  password: 'password123',
  name: 'Dr. Alan Grant',
  token: 'fake-jwt-token-for-session'
}

export const loginApi = (
  credentials: LoginCredentials
): Promise<{ token: string; userName: string }> => {
  console.log('Enviando credenciales a la API (simulado):', credentials)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        credentials.email === MOCK_USER.email &&
        credentials.password === MOCK_USER.password
      ) {
        console.log('API dice: Credenciales correctas.')
        // Si las credenciales son correctas, devolvemos el token y el nombre
        resolve({ token: MOCK_USER.token, userName: MOCK_USER.name })
      } else {
        console.log('API dice: Credenciales incorrectas.')
        // Si no, devolvemos un error
        reject(new Error('El correo o la contraseña son incorrectos.'))
      }
    }, 1500)
  })
}
