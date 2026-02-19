import React from 'react';
import type { InventarioLote } from '../../types';
import { BsBoxSeam, BsExclamationTriangle } from 'react-icons/bs';

interface Props {
  isOpen: boolean;
  medicamentos: InventarioLote[];
  cantidades: { [key: string]: string };
  onCancel: () => void;
  onConfirm: () => void;
  despachando: boolean;
}

export const ConfirmDispatchModal: React.FC<Props> = ({
  isOpen,
  medicamentos,
  cantidades,
  onCancel,
  onConfirm,
  despachando
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden animate-fade-in border border-gray-200">
        
        {/* Encabezado Limpio y Clínico */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-4">
          <div className="bg-blue-100 p-2.5 rounded-lg text-blue-600">
            <BsBoxSeam size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Confirmación de Despacho</h3>
            <p className="text-sm text-gray-500">Revise las ubicaciones y lotes antes de procesar la salida de inventario.</p>
          </div>
        </div>

        <div className="p-6">
          {/* Mensaje sutil de auditoría */}
          <div className="flex items-start gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg text-sm mb-5 border border-amber-100">
            <BsExclamationTriangle className="mt-0.5 shrink-0" size={16} />
            <p>
              <strong>Atención:</strong> Asegúrese de despachar exactamente los lotes indicados para mantener la integridad de la norma FEFO en el inventario.
            </p>
          </div>

          {/* Tabla de Resumen (Fácil de leer para el Auxiliar) */}
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200 uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-3 px-4">Medicamento</th>
                  <th className="py-3 px-4">Ubicación</th>
                  <th className="py-3 px-4">Lote a entregar</th>
                  <th className="py-3 px-4">Vencimiento</th>
                  <th className="py-3 px-4 text-center border-l border-gray-200 bg-blue-50/50">Cantidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {medicamentos.map((med) => (
                  <tr key={med.numeroLote} className="hover:bg-gray-50 transition-colors">
                    
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-800">{med.nombreMedicamento}</div>
                      <div className="text-xs text-gray-500">{med.presentacion}</div>
                    </td>
                    
                    <td className="py-3 px-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium border border-gray-200">
                        {med.ubicacion || 'Gral'}
                      </span>
                    </td>
                    
                    <td className="py-3 px-4 font-mono font-bold text-gray-700">
                      {med.numeroLote}
                    </td>
                    
                    <td className="py-3 px-4 text-gray-600 font-medium">
                      {med.fechaVencimiento}
                    </td>
                    
                    <td className="py-3 px-4 text-center border-l border-gray-200 bg-blue-50/30">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold shadow-sm">
                        {cantidades[med.numeroLote] || 0}
                      </span>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Botones de Acción Clásicos */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={onCancel}
              disabled={despachando}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              onClick={onConfirm}
              disabled={despachando}
              className="px-6 py-2.5 text-sm font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center gap-2 shadow-sm"
            >
              {despachando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Procesando...
                </>
              ) : (
                'Confirmar Despacho'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};