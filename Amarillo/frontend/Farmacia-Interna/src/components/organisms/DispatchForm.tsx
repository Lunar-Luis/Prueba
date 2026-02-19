import React from 'react';
import type { InventarioLote } from '../../types';
import { DispatchItem } from '../molecules/DispatchItem';
import { BsBoxSeam } from "react-icons/bs";

interface Props {
  medicamentosSeleccionados: InventarioLote[];
  cantidades: { [key: string]: string };
  errores: { [key: string]: string };
  errorGlobal: string | null;
  despachando: boolean;
  alCambiarCantidad: (numeroLote: string, valor: string) => void;
  alQuitarItem: (numeroLote: string) => void;
  alLimpiar: () => void;
  alConfirmarDespacho: () => void;
}

export const DispatchForm: React.FC<Props> = ({
  medicamentosSeleccionados,
  cantidades,
  errores,
  errorGlobal,
  despachando,
  alCambiarCantidad,
  alQuitarItem,
  alLimpiar,
  alConfirmarDespacho,
}) => (
  // ✅ CAMBIO 1: lg:col-span-1 a md:col-span-1 para arreglar el problema visual en tu laptop
  <div className="md:col-span-1 space-y-8 sticky top-24">
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 border-b pb-3 mb-4">
        <BsBoxSeam size={24} className="text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">Despacho por Lote</h2>
      </div>

      {medicamentosSeleccionados.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <BsBoxSeam className="mx-auto mb-4 text-6xl text-gray-300" />
          <p className="mt-2 font-medium">Seleccione los lotes.</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault(); 
            alConfirmarDespacho();
          }}
        >
          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
            {medicamentosSeleccionados.map((med) => (
              <DispatchItem
                key={med.numeroLote} // ✅ CAMBIO 2: Usamos el lote exacto como key
                medicamento={med}
                cantidad={cantidades[med.numeroLote] || ""} // ✅ Buscamos la cantidad por lote
                error={errores[med.numeroLote]} // ✅ Buscamos los errores por lote
                despachando={despachando}
                alCambiarCantidad={alCambiarCantidad}
                alQuitar={alQuitarItem}
              />
            ))}
          </div>

          {errorGlobal && (
            <p className="text-sm text-red-600 mt-4">{errorGlobal}</p>
          )}

          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={despachando || medicamentosSeleccionados.length === 0}
              className="flex-1 py-2 px-4 border rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 font-bold"
            >
              {despachando ? 'Despachando...' : `Despachar (${medicamentosSeleccionados.length})`}
            </button>
            <button
              type="button"
              onClick={alLimpiar}
              disabled={despachando}
              className="flex-1 py-2 px-4 border rounded-md bg-white hover:bg-gray-50 font-bold"
            >
              Limpiar
            </button>
          </div>
        </form>
      )}
    </div>
  </div>
);