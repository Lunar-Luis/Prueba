import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginCard } from '../components/organisms/LoginCard';
import { loginRequest } from '../services/authService';
import type { LoginFormData } from '../types/auth';
import { toast } from 'react-toastify';

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginFormData>({
    nombre: '',
    password: '',
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // --- NUEVA VALIDACIÓN (Commit Parte 1) ---
    // Evitamos enviar datos vacíos al servidor
    if (!form.nombre.trim() || !form.password.trim()) {
      toast.warning('⚠️ Por favor, complete todos los campos antes de ingresar.');
      return; // Detenemos la función aquí
    }
    // ----------------------------------------

    try {
      // Ahora 'data' trae: token, rol, nombre e ID
      const data = await loginRequest(form);

      // Guardamos Token y Rol (como antes)
      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.rol);

      // NUEVO: Guardamos el ID para que el Despacho sepa quién eres
      localStorage.setItem('usuarioId', data.id.toString());

      // NUEVO: Guardamos el Nombre para mostrar "Bienvenido, Pedro" en el Header
      localStorage.setItem('nombre', data.nombre);

      // Notificación de éxito opcional
      toast.success(`Bienvenido, ${data.nombre}`);

      data.rol === 'farmaceutico'
        ? navigate('/farmaceutico')
        : navigate('/auxiliar');

    } catch (error: any) {
      if (error.status === 401) {
        toast.error('⛔ Usuario o contraseña incorrectos');
      } else {
        toast.error('❌ Error de conexión con el servidor');
      }

      console.error(error);
    }
  };

  return (
    <LoginCard
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
    />
  );
};