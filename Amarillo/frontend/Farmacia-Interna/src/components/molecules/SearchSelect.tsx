import React, { useState, useEffect } from 'react';
import { Input } from '../atoms/Input';
import { buscarMedicamentos } from '../../api/medicamentos';

interface Props {
  onSelect: (medicamento: any) => void;
  onCreateNew: (nombre: string) => void;
}

export const SearchSelect: React.FC<Props> = ({ onSelect, onCreateNew }) => {
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    // Debounce: Espera 300ms antes de llamar al backend
    const timer = setTimeout(async () => {
      if (busqueda.length >= 2) {
        setCargando(true);
        const data = await buscarMedicamentos(busqueda);
        setResultados(data);
        setCargando(false);
        setMostrarMenu(true);
      } else {
        setResultados([]);
        setMostrarMenu(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [busqueda]);

  return (
    <div className="relative w-full z-50">
      <Input 
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="🔍 Buscar (ej: Paracetamol 500mg)..."
        className="bg-white focus:ring-2 focus:ring-blue-500"
        autoComplete="off"
      />
      
      {mostrarMenu && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-60 overflow-y-auto animate-fade-in">
          {resultados.length > 0 ? (
            resultados.map((med) => (
              <div 
                key={med.codigo}
                onClick={() => {
                  onSelect(med);
                  setBusqueda(med.nombre); // Pone el nombre en el input
                  setMostrarMenu(false);
                }}
                className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 transition-colors"
              >
                {/* NOMBRE DEL PRODUCTO */}
                <p className="font-bold text-gray-800 text-sm">{med.nombre}</p>
                
                {/* DETALLES DE NORMALIZACIÓN (Aquí mostramos los campos separados) */}
                <p className="text-xs text-gray-500 flex gap-2 mt-1">
                   <span className="bg-blue-100 text-blue-800 px-1.5 rounded">{med.concentracion || '? mg'}</span>
                   <span className="bg-gray-100 text-gray-600 px-1.5 rounded">{med.presentacion?.nombre || 'Unidad'}</span>
                   <span>• {med.marca?.nombre || 'Genérico'}</span>
                </p>
              </div>
            ))
          ) : (
            <div className="p-3 text-sm text-gray-500 italic">
              {!cargando && "No encontrado en catálogo."}
            </div>
          )}
          
          {/* OPCIÓN DE CREAR NUEVO */}
          <div 
            onClick={() => {
              onCreateNew(busqueda);
              setMostrarMenu(false);
            }}
            className="p-3 bg-blue-50 hover:bg-blue-100 cursor-pointer text-blue-700 font-bold text-sm flex items-center gap-2 border-t border-blue-100"
          >
            <span>➕ Registrar Nuevo: "{busqueda}"</span>
          </div>
        </div>
      )}
    </div>
  );
};