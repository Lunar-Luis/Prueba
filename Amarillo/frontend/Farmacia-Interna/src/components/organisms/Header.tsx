import React from 'react';
import { BsHospital } from "react-icons/bs";
import { LogOut } from "lucide-react";

interface Props {
  nombreUsuario: string;
  alCerrarSesion: () => void;
}

export const Header: React.FC<Props> = ({ nombreUsuario, alCerrarSesion }) => (
  <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <BsHospital className="h-8 w-auto text-blue-600" />
        <span className="text-xl font-bold text-gray-800">Farmacia Hospitalaria</span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600 hidden sm:block">Bienvenido, {nombreUsuario}</span>
        <button
          onClick={alCerrarSesion}
          className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
        >
          <LogOut size={20} />
          <span className="hidden md:block">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  </header>
);