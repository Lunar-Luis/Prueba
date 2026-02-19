import React from 'react';
import type { InventarioLote } from '../../types';
import { X } from 'lucide-react';

interface Props {
  medicamento: InventarioLote;
  cantidad: string;
  error: string | undefined;
  despachando: boolean;
  alCambiarCantidad: (numeroLote: string, valor: string) => void;
  alQuitar: (numeroLote: string) => void;
}

export const DispatchItem: React.FC<Props> = ({
  medicamento, cantidad, error, despachando, alCambiarCantidad, alQuitar
}) => (
  <div className="relative p-3 border rounded-md bg-gray-50 border-gray-200">
    <div className="flex justify-between items-start">
      <div className="pr-6">
        <p className="font-bold text-gray-800 leading-tight">{medicamento.nombreMedicamento}</p>
        {/* ✅ AÑADIDO: Mostramos el número de lote para que el auxiliar sepa qué caja despachar */}
        <p className="text-xs text-blue-600 font-mono font-bold mt-1">Lote: {medicamento.numeroLote}</p>
      </div>
      <button
        type="button"
        // ✅ CAMBIO: Pasamos el numeroLote al quitar
        onClick={() => alQuitar(medicamento.numeroLote)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
        aria-label={`Quitar lote ${medicamento.numeroLote}`}
        disabled={despachando}
      >
        <X size={16} />
      </button>
    </div>
    
    <p className="text-xs text-gray-500 mt-2 mb-2">Stock disponible: {medicamento.stock}</p>
    
    <div className="flex items-center space-x-2">
      <label htmlFor={`cantidad-${medicamento.numeroLote}`} className="text-sm font-medium text-gray-700">
        Cant:
      </label>
      <input
        type="number"
        // ✅ CAMBIO: Los IDs e inputs ahora usan numeroLote
        id={`cantidad-${medicamento.numeroLote}`}
        value={cantidad}
        onChange={(e) => alCambiarCantidad(medicamento.numeroLote, e.target.value)}
        className="block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 font-bold"
        placeholder="0"
        min="1"
        max={medicamento.stock}
        disabled={despachando || medicamento.stock === 0}
        required
      />
    </div>
    {error && (
      <p className="text-xs text-red-600 mt-1 font-bold">{error}</p>
    )}
  </div>
);