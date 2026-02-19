export type UserRole = 'farmaceutico' | 'auxiliar';

export interface LoginFormData {
  nombre: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  rol: UserRole;
  nombre: string;
}