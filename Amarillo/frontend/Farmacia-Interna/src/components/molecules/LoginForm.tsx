import React from 'react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import type { LoginFormData } from '../../types/auth';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'; // ✅ Importamos los íconos

interface LoginFormProps {
  form: LoginFormData;
  setForm: React.Dispatch<React.SetStateAction<LoginFormData>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  // ✅ Nuevas Props Opcionales (para mantener compatibilidad)
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  form,
  setForm,
  onSubmit,
  showPassword = false, // Valor por defecto false
  onTogglePassword,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      
      {/* Input de Usuario (Sin cambios) */}
      <Input
        type="text"
        placeholder="Nombre de usuario"
        value={form.nombre}
        required
        onChange={(e) =>
          setForm({ ...form, nombre: e.target.value })
        }
      />

      {/* ✅ Input de Contraseña con el Ojo Mágico */}
      <div className="relative group">
        <Input
          // Aquí ocurre la magia: cambiamos el tipo según el estado
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña"
          value={form.password}
          required
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          // Agregamos padding extra a la derecha para que el texto no choque con el ojo
          // (Asumiendo que tu componente Input acepta className o style)
          className="pr-10" 
        />

        {/* Botón del Ojo (Solo se muestra si pasamos la función toggle) */}
        {onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors cursor-pointer focus:outline-none"
            title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={22} />
            ) : (
              <AiOutlineEye size={22} />
            )}
          </button>
        )}
      </div>

      {/* Botón de Ingreso (Estilizado) */}
      <Button 
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
      >
        Ingresar
      </Button>
    </form>
  );
};