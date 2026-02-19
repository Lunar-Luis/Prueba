import React, { useState } from 'react';
import type { InventarioLote } from '../../types';
import { SearchInput } from '../molecules/SearchInput';
import { Select } from '../atoms/Select'; // ✅ Importamos el Select
import { BsBoxSeam, BsGeoAltFill, BsTrash, BsExclamationCircleFill } from "react-icons/bs";

interface Props {
  medicamentosFiltrados: InventarioLote[];
  medicamentosDespachables: InventarioLote[];
  codigosSeleccionados: string[]; // Ahora guarda los numeroLote
  terminoBusqueda: string;
  cargando: boolean;
  error: string | null;
  alCambiarBusqueda: (valor: string) => void;
  alAlternarSeleccion: (loteId: string) => void;
  alSeleccionarTodos: (e: React.ChangeEvent<HTMLInputElement>, lista: InventarioLote[]) => void;
  mostrarSeleccion?: boolean;
  onDarDeBaja?: (med: InventarioLote) => void; // Prop para la Merma
}

export const MedicamentosTable: React.FC<Props> = ({
  medicamentosFiltrados,
  codigosSeleccionados,
  terminoBusqueda,
  cargando,
  error,
  alCambiarBusqueda,
  alAlternarSeleccion,
  alSeleccionarTodos,
  mostrarSeleccion = true, 
  onDarDeBaja
}) => {
  
  const [filtroEstatus, setFiltroEstatus] = useState("TODOS"); // ✅ NUEVO ESTADO PARA EL FILTRO

  // Función mejorada para detectar vencimiento
  const esVencido = (fechaString: string, estadoBackend?: string) => {
    if (estadoBackend === "VENCIDO") return true;
    if (!fechaString || fechaString === "-" || fechaString === "SIN STOCK VÁLIDO") return false;
    const fechaVence = new Date(fechaString + 'T00:00:00'); 
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); 
    return fechaVence < hoy;
  };

  // ✅ LÓGICA FEFO: 1. Filtrar solo válidos
  const lotesValidos = medicamentosFiltrados.filter(
    m => m.stock > 0 && 
         (m.estado === 'DISPONIBLE' || m.estado === 'Activo') &&
         !esVencido(m.fechaVencimiento, m.estado)
  );

  // ✅ LÓGICA FEFO: 2. Buscar la fecha más antigua por cada medicamento (por su código genérico)
  const fechasMasAntiguasPorCodigo: Record<string, number> = {};
  
  lotesValidos.forEach(med => {
      const fechaVence = new Date(med.fechaVencimiento + 'T00:00:00').getTime();
      const codigo = med.medicamentoCodigo;
      if (!fechasMasAntiguasPorCodigo[codigo] || fechaVence < fechasMasAntiguasPorCodigo[codigo]) {
          fechasMasAntiguasPorCodigo[codigo] = fechaVence; // Guardamos la fecha más vieja encontrada
      }
  });

  // ✅ LÓGICA FEFO: 3. Filtrar la lista final permitida para "Seleccionar Todos"
  const listaVisibleFEFO = lotesValidos.filter(med => {
      const fechaVence = new Date(med.fechaVencimiento + 'T00:00:00').getTime();
      return fechaVence === fechasMasAntiguasPorCodigo[med.medicamentoCodigo];
  });

  const todosSeleccionados = listaVisibleFEFO.length > 0 && 
                             listaVisibleFEFO.every(m => codigosSeleccionados.includes(m.numeroLote));

  // ✅ FILTRADO FINAL PARA LA TABLA (Aplica el filtro visual del Jefe)
  const listaFinalParaMostrar = medicamentosFiltrados.filter((med) => {
      const estaVencido = esVencido(med.fechaVencimiento, med.estado);
      const sinStock = med.stock === 0 || med.estado === 'AGOTADO';
      
      let estatusReal = "ACTIVO";
      if (estaVencido) estatusReal = "VENCIDO";
      else if (sinStock) estatusReal = "AGOTADO";

      // Si es el Jefe y seleccionó un filtro específico, evaluamos
      if (!mostrarSeleccion && filtroEstatus !== "TODOS") {
          return filtroEstatus === estatusReal;
      }
      return true;
  });

  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 border-b pb-3 mb-4">
        <BsBoxSeam size={24} className="text-gray-600" />
        <h2 className="text-xl font-semibold text-gray-800">
          {mostrarSeleccion ? "Despacho por Lote (Norma FEFO)" : "Auditoría General de Lotes"}
        </h2>
      </div>
      
      {/* ✅ BARRA DE BÚSQUEDA Y NUEVO FILTRO */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <SearchInput 
            terminoBusqueda={terminoBusqueda} 
            alCambiarBusqueda={alCambiarBusqueda}
            placeholder="Buscar por nombre o código..." 
          />
        </div>
        
        {/* El filtro de estatus solo lo ve el Jefe */}
        {!mostrarSeleccion && (
          <Select
            value={filtroEstatus}
            onChange={(val) => setFiltroEstatus(val)}
            options={[
              { value: "TODOS", label: "Todos los estatus" },
              { value: "ACTIVO", label: "Solo Activos" },
              { value: "AGOTADO", label: "Solo Agotados" },
              { value: "VENCIDO", label: "Solo Vencidos" },
            ]}
            className="w-full md:w-48"
          />
        )}
      </div>
      
      <div className="overflow-auto max-h-[52vh] rounded-lg border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead className="border-b bg-gray-50 sticky top-0 z-10">
            <tr>
              {mostrarSeleccion && (
                <th className="p-3 w-12 text-center">
                    <input 
                      type="checkbox" 
                      onChange={(e) => alSeleccionarTodos(e, listaVisibleFEFO)} 
                      checked={todosSeleccionados} 
                      disabled={listaVisibleFEFO.length === 0} 
                      className="h-4 w-4 rounded border-gray-300 cursor-pointer text-blue-600 focus:ring-blue-500 disabled:opacity-50" 
                      title="Seleccionar todos los permitidos"
                    />
                </th>
              )}

              <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">CÓDIGO</th>
              <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">MEDICAMENTO</th>
              <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">PRESENTACIÓN</th>
              
              <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                    <BsGeoAltFill /> UBICACIÓN
                </div>
              </th>
              
              <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">LOTE</th>
              <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">VENCE</th>
              <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">STOCK</th>
              
              {!mostrarSeleccion && <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">ESTATUS</th>}
              {onDarDeBaja && <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">BAJA</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* ✅ AHORA MAPEA listaFinalParaMostrar EN LUGAR DE medicamentosFiltrados */}
            {listaFinalParaMostrar.map((med) => {
                
                const estaVencido = esVencido(med.fechaVencimiento, med.estado);
                const sinStock = med.stock === 0 || med.estado === 'AGOTADO';
                
                const fechaVenceEsteLote = new Date(med.fechaVencimiento + 'T00:00:00').getTime();
                const esElProximoAVencer = fechaVenceEsteLote === fechasMasAntiguasPorCodigo[med.medicamentoCodigo];

                const esSeleccionable = !estaVencido && !sinStock && esElProximoAVencer;

                const filaOpaca = mostrarSeleccion && !esSeleccionable;

                let tooltipMensaje = "Seleccionar lote";
                if (estaVencido) tooltipMensaje = "Lote vencido";
                else if (sinStock) tooltipMensaje = "Sin stock";
                else if (!esElProximoAVencer) tooltipMensaje = "Bloqueado por FEFO: Hay un lote más próximo a vencer.";

                return (
                  <tr 
                    key={med.numeroLote}
                    className={`hover:bg-blue-50 transition-colors border-b last:border-0 
                        ${codigosSeleccionados.includes(med.numeroLote) ? 'bg-blue-50' : ''}
                        ${filaOpaca ? 'opacity-60 bg-gray-50' : ''}`
                    }
                  >
                    {mostrarSeleccion && (
                        <td className="p-3 text-center" title={tooltipMensaje}>
                            <input 
                                type="checkbox"
                                checked={codigosSeleccionados.includes(med.numeroLote)} 
                                onChange={() => alAlternarSeleccion(med.numeroLote)} 
                                disabled={!esSeleccionable} 
                                className="h-4 w-4 rounded border-gray-300 cursor-pointer text-blue-600 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
                            />
                        </td>
                    )}

                    <td className="p-3 text-sm font-medium text-gray-900 font-mono">{med.medicamentoCodigo}</td>
                    
                    <td className="p-3 text-sm text-gray-700">
                        <div className='font-bold text-gray-800'>{med.nombreMedicamento}</div>
                        <div className='text-xs text-gray-500'>{med.marca} - {med.linea}</div>
                    </td>

                    <td className="p-3 text-sm text-gray-600">{med.presentacion}</td>
                    
                    <td className="p-3 text-sm text-blue-600 font-bold bg-blue-50/50 rounded-lg">
                        <span className="bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                            {med.ubicacion || 'General'}
                        </span>
                    </td>

                    <td className="p-3 text-sm text-gray-500 font-mono font-bold">{med.numeroLote}</td>
                    
                    <td className={`p-3 text-sm font-bold ${estaVencido ? 'text-red-600' : 'text-green-600'}`}>
                        {med.fechaVencimiento}
                    </td>
                    
                    <td className={`p-3 text-sm font-bold text-right ${sinStock ? 'text-red-500' : 'text-gray-800'}`}>
                        {med.stock}
                    </td>

                    {!mostrarSeleccion && (
                        <td className="p-3 text-center">
                            {estaVencido ? (
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold flex items-center justify-center gap-1">
                                   <BsExclamationCircleFill size={12}/> Vencido
                                </span>
                            ) : sinStock ? (
                                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">
                                   Agotado
                                </span>
                            ) : (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                                   Activo
                                </span>
                            )}
                        </td>
                    )}

                    {onDarDeBaja && (
                        <td className="p-3 text-center">
                            <button 
                                onClick={() => onDarDeBaja(med)}
                                disabled={sinStock}
                                className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Registrar Merma / Dar de Baja"
                            >
                                <BsTrash size={18} />
                            </button>
                        </td>
                    )}

                  </tr>
                );
            })}
          </tbody>
        </table>
        
        {/* Estados de Carga, Error o Vacío */}
        {!cargando && listaFinalParaMostrar.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
             <BsBoxSeam size={48} className="mb-2 opacity-20" />
             <p>No se encontraron resultados para los filtros seleccionados.</p>
          </div>
        )}
        {cargando && (
          <p className="text-center text-blue-600 mt-8 py-4 animate-pulse">Cargando inventario...</p>
        )}
        {!cargando && error && (
          <p className="text-center text-red-500 mt-8 py-4 bg-red-50 rounded mx-4 border border-red-100">{error}</p>
        )}
      </div>
    </div>
  );
};