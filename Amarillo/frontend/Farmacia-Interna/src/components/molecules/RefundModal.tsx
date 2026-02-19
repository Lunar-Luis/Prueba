import React, { useState, useEffect } from 'react';
import { BsBoxArrowInDownLeft, BsExclamationTriangle } from "react-icons/bs";

interface Props {
  isOpen: boolean;
  movimiento: any | null;
  onCancel: () => void;
  onConfirm: (cantidad: number) => void;
  procesando: boolean;
}

export const RefundModal: React.FC<Props> = ({ 
  isOpen, 
  movimiento, 
  onCancel, 
  onConfirm,
  procesando 
}) => {
  const [cantidad, setCantidad] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Calculamos disponible (Total - YaReembolsado)
  const disponible = movimiento ? (movimiento.cantidad - (movimiento.cantidadReembolsada || 0)) : 0;

  useEffect(() => {
    if (isOpen && movimiento) {
        setCantidad("");
        setError(null);
    }
  }, [isOpen, movimiento]);

  if (!isOpen || !movimiento) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(cantidad);

    if (isNaN(qty) || qty <= 0) {
        setError("La cantidad debe ser mayor a 0.");
        return;
    }
    // Validación contra el saldo pendiente real
    if (qty > disponible) {
        setError(`Solo puedes devolver hasta ${disponible} unidades.`);
        return;
    }

    onConfirm(qty);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center backdrop-blur-sm transition-opacity px-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in scale-100 border border-gray-200">
            
            {/* HEADER AZUL */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    <BsBoxArrowInDownLeft size={22} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Reingreso al Inventario</h3>
                    <p className="text-sm text-gray-500">Procesar devolución de producto</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                
                {/* TARJETA INFO */}
                <div className="bg-blue-50/50 p-4 rounded-lg mb-6 border border-blue-100">
                    <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Medicamento Seleccionado</p>
                    <p className="font-bold text-gray-800 text-base mb-3 leading-tight">{movimiento.nombreMedicamento || 'Desconocido'}</p>
                    
                    <div className="flex justify-between items-center text-sm border-t border-blue-200/50 pt-3 mt-3">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-xs">Lote Origen</span>
                            <span className="font-mono text-gray-700 font-medium">{movimiento.numeroLote}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-gray-500 text-xs">Disponible para Reembolso</span>
                            {/* Muestra Saldo vs Total */}
                            <span className="font-bold text-blue-600 text-base">{disponible} / {movimiento.cantidad} un.</span>
                        </div>
                    </div>
                </div>

                {/* INPUT CANTIDAD */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Cantidad a Reingresar
                    </label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={cantidad}
                            onChange={(e) => {
                                setCantidad(e.target.value);
                                setError(null);
                            }}
                            className={`w-full p-3 pl-4 border rounded-lg outline-none text-lg font-bold text-gray-800 transition-all bg-gray-50 focus:bg-white ${error ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400'}`}
                            placeholder="0"
                            autoFocus
                            disabled={procesando}
                        />
                        <span className="absolute right-4 top-3.5 text-gray-400 text-sm font-medium">Unidades</span>
                    </div>
                    {error && (
                        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm font-medium animate-pulse">
                            <BsExclamationTriangle />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                {/* BOTONES */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button 
                        type="button" 
                        onClick={onCancel}
                        disabled={procesando}
                        className="px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        disabled={procesando}
                        className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-wait flex items-center gap-2"
                    >
                        {procesando ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Procesando...
                            </>
                        ) : (
                            <>
                                <BsBoxArrowInDownLeft size={18} />
                                Confirmar Reingreso
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};