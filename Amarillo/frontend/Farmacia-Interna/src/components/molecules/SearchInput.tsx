import React from 'react';
import { Search } from 'lucide-react';

interface Props {
  terminoBusqueda: string;
  alCambiarBusqueda: (valor: string) => void;
  placeholder?: string;
}

export const SearchInput: React.FC<Props> = ({ terminoBusqueda, alCambiarBusqueda, placeholder }) => (
  <div className="relative w-full">
    <input
      type="text"
      placeholder={placeholder}
      value={terminoBusqueda}
      onChange={(e) => alCambiarBusqueda(e.target.value)}
      className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500"
    />
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
  </div>
);