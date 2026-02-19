import React, { useState } from 'react';
import { LoginForm } from '../molecules/LoginForm';
import type { LoginFormData } from '../../types/auth';
import { BsBuildings } from 'react-icons/bs';

interface LoginCardProps {
  form: LoginFormData;
  setForm: React.Dispatch<React.SetStateAction<LoginFormData>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const LoginCard: React.FC<LoginCardProps> = ({
  form,
  setForm,
  onSubmit,
}) => {
  // ✅ 1. NUEVO ESTADO: Aquí controlamos la visibilidad de la contraseña
  // Esto cumple con el requisito de "Lógica Relevante" en el Frontend
  const [showPassword, setShowPassword] = useState(false);

  // Función auxiliar para alternar el estado
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        
        {/* LOGO (Sin cambios) */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-600 text-white p-3 rounded-xl shadow-md mb-3">
            <BsBuildings size={28} />
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            Farmacia Hospitalaria
          </h1>
          <p className="text-xs text-gray-500">
            Sistema Interno de Gestión
          </p>
        </div>

        {/* FORM (Con las nuevas props conectadas) */}
        <LoginForm
          form={form}
          setForm={setForm}
          onSubmit={onSubmit}
          showPassword={showPassword} 
          onTogglePassword={togglePasswordVisibility}
        />


        {/* FOOTER (Sin cambios) */}
        <p className="mt-6 text-center text-[10px] text-gray-400">
          Acceso exclusivo para personal autorizado
        </p>
      </div>
    </div>
  );
};