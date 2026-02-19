import React, { useEffect, useState } from 'react';
import { BsReceipt, BsX } from "react-icons/bs";

interface MovimientoSimple {
    id: number;
    nombreMedicamento: string;
    cantidad: number;
    numeroLote: string;
}

interface Props {
    isOpen: boolean;
    transaccionId: string | null;
    onClose: () => void;
}

export const DispatchDetailModal: React.FC<Props> = ({ isOpen, transaccionId, onClose }) => {
    const [items, setItems] = useState<MovimientoSimple[]>([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (isOpen && transaccionId) {
            setCargando(true);
            fetch(`http://localhost:8080/api/movimientos/detalle/${transaccionId}`)
                .then(res => res.json())
                .then(data => setItems(data))
                .catch(err => console.error(err))
                .finally(() => setCargando(false));
        } else {
            setItems([]);
        }
    }, [isOpen, transaccionId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <BsReceipt size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">Detalle de Transacción</h3>
                            <p className="text-xs text-gray-500 font-mono">{transaccionId}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <BsX size={24} />
                    </button>
                </div>

                {/* Lista */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {cargando ? (
                        <p className="text-center text-gray-500 py-4">Cargando detalles...</p>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2">Medicamento</th>
                                    <th className="px-3 py-2">Lote</th>
                                    <th className="px-3 py-2 text-right">Cant.</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-3 py-3 font-medium text-gray-800">
                                            {item.nombreMedicamento}
                                        </td>
                                        <td className="px-3 py-3 font-mono text-gray-500 text-xs">
                                            {item.numeroLote}
                                        </td>
                                        <td className="px-3 py-3 text-right font-bold text-gray-700">
                                            {item.cantidad}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="border-t border-gray-200">
                                <tr>
                                    <td colSpan={2} className="px-3 py-3 font-bold text-right text-gray-800">Total Items:</td>
                                    <td className="px-3 py-3 text-right font-bold text-blue-600">
                                        {items.reduce((sum, item) => sum + item.cantidad, 0)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};