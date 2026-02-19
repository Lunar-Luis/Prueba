import React from "react";
import { SearchInput } from "../molecules/SearchInput";
import { 
    BsClockHistory, 
    BsArrowUpShort, 
    BsArrowDownShort, 
    BsChevronLeft, 
    BsChevronRight,
    BsArrowCounterclockwise,
    BsEye,
    BsPersonBadge
} from "react-icons/bs";
import { Select } from "../atoms/Select";

// Interface Actualizada
export interface Movimiento {
  id: number;
  codigoMedicamento: string;
  nombreMedicamento?: string;
  rol: string;
  usuario: string;
  cantidad: number;
  tipo: "DESPACHO" | "ENTRADA" | "DEVOLUCION" | "BAJA" | string;
  fecha: string;
  numeroLote: string;
  cantidadReembolsada: number; 
  transaccionId?: string; 
}

interface Props {
  movimientosFiltrados: Movimiento[];
  terminoBusqueda: string;
  estado: string;
  filtroFecha: string; 
  filtroUsuario?: string; // ✅ NUEVO
  auxiliaresDisponibles?: string[]; // ✅ NUEVO
  cargando: boolean;
  error: string | null;
  alCambiarBusqueda: (valor: string) => void;
  alCambiarEstado: (estado: any) => void;
  alCambiarFiltroFecha: (fecha: string) => void; 
  alCambiarFiltroUsuario?: (usuario: string) => void; // ✅ NUEVO
  paginaActual: number;
  totalPaginas: number;
  alCambiarPagina: (pagina: number) => void;
  onDevolucion?: (movimiento: Movimiento) => void;
  onVerDetalle?: (transaccionId: string) => void;
}

export const MovimientosTable: React.FC<Props> = ({
  movimientosFiltrados,
  terminoBusqueda,
  estado,
  filtroFecha,
  filtroUsuario, 
  auxiliaresDisponibles,
  cargando,
  alCambiarBusqueda,
  alCambiarEstado,
  alCambiarFiltroFecha,
  alCambiarFiltroUsuario,
  paginaActual,
  totalPaginas,
  alCambiarPagina,
  onDevolucion,
  onVerDetalle
}) => {
  
  const rolRaw = localStorage.getItem('rol');
  const rolActual = rolRaw ? rolRaw.toUpperCase() : ''; 

  const formatearFecha = (fechaIso: string) => {
    if (!fechaIso) return "-";
    const fecha = new Date(fechaIso);
    return fecha.toLocaleString('es-VE', { 
        day: '2-digit', month: '2-digit', year: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
    });
  };

  // ✅ OPCIONES DINÁMICAS SEGÚN EL ROL
  const opcionesEstado = rolActual === 'FARMACEUTICO' 
    ? [
        { value: "TODOS", label: "Todos los tipos" },
        { value: "DESPACHO", label: "Salidas (Ventas)" },
        { value: "ENTRADA", label: "Entradas (Compras)" },
        { value: "DEVOLUCION", label: "Devoluciones" },
        { value: "BAJA", label: "Mermas / Bajas" },
      ]
    : [
        { value: "TODOS", label: "Todos los tipos" },
        { value: "DESPACHO", label: "Solo Salidas" },
        { value: "DEVOLUCION", label: "Solo Devoluciones" },
      ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in flex flex-col h-full">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
            <BsClockHistory size={24} className="text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              {rolActual === 'FARMACEUTICO' ? 'Auditoría de Movimientos' : 'Mis Movimientos'}
            </h2>
        </div>
        <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
            Página {paginaActual + 1}
        </span>
      </div>

      {/* FILTROS ACTUALIZADOS */}
      <div className="flex flex-col xl:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput
            terminoBusqueda={terminoBusqueda}
            alCambiarBusqueda={alCambiarBusqueda}
            placeholder={rolActual === 'FARMACEUTICO' ? "Buscar código, responsable o comprobante..." : "Buscar comprobante o lote..."}
          />
        </div>
        
        {/* SELECTOR DE FECHA */}
        <Select
          value={filtroFecha}
          onChange={(value) => alCambiarFiltroFecha(value)}
          options={[
            { value: "TODOS", label: "Cualquier fecha" },
            { value: "HOY", label: "Solo Hoy" }
          ]}
          className="w-full xl:w-40"
        />

        {/* SELECTOR DE ESTADO (Dinámico) */}
        <Select
          value={estado}
          onChange={(value) => alCambiarEstado(value)}
          options={opcionesEstado}
          className="w-full xl:w-48"
        />

        {/* ✅ NUEVO: SELECTOR DE AUXILIAR (Solo Farmacéutico) */}
        {rolActual === 'FARMACEUTICO' && auxiliaresDisponibles && (
          <div className="w-full xl:w-48">
            <Select
              value={filtroUsuario || "TODOS"}
              onChange={(value) => alCambiarFiltroUsuario && alCambiarFiltroUsuario(value)}
              options={[
                { value: "TODOS", label: "Todos los Usuarios" },
                ...auxiliaresDisponibles.map(aux => ({ value: aux, label: aux }))
              ]}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 mb-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Medicamento</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Lote</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Responsable</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Cantidad</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Fecha</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Acción</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movimientosFiltrados.map((mov) => {
              const esSalida = mov.tipo === "DESPACHO"; 
              const esDevolucion = mov.tipo === "DEVOLUCION";
              
              const cantReembolsada = mov.cantidadReembolsada || 0;
              const totalmenteReembolsado = cantReembolsada >= mov.cantidad;

              return (
              <tr key={mov.id} className={`hover:bg-gray-50 transition-colors ${esDevolucion ? 'bg-orange-50/30' : ''}`}>
                
                {/* 1. TIPO */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`flex items-center text-sm font-bold ${
                      esSalida ? 'text-red-600' : 
                      esDevolucion ? 'text-orange-500' : 
                      mov.tipo === 'BAJA' ? 'text-amber-700' : 'text-green-600'
                  }`}>
                    {esSalida ? <BsArrowUpShort size={18} /> : 
                     esDevolucion ? <BsArrowCounterclockwise size={16} className="mr-1"/> : 
                     <BsArrowDownShort size={18} />}
                    
                    {esSalida ? 'Salida' : esDevolucion ? 'Reembolso' : mov.tipo === 'BAJA' ? 'Baja/Merma' : 'Entrada'}
                  </span>
                </td>

                {/* 2. MEDICAMENTO */}
                <td className="px-4 py-4">
                    <div className="text-sm font-bold text-gray-800">
                        {mov.nombreMedicamento || 'Desconocido'}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                        {mov.codigoMedicamento}
                    </div>
                </td>

                {/* 3. LOTE */}
                <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 font-mono border border-gray-200">
                        {mov.numeroLote}
                    </span>
                </td>

                {/* 4. RESPONSABLE */}
                <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-800 flex items-center gap-1">
                        {rolActual === 'FARMACEUTICO' && mov.rol === 'AUXILIAR' && <BsPersonBadge className="text-blue-500" title="Auxiliar"/>}
                        {mov.usuario}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                        {mov.rol.toLowerCase()}
                    </div>
                </td>

                {/* 5. CANTIDAD */}
                <td className={`px-4 py-4 whitespace-nowrap text-right text-sm font-bold ${
                    esSalida ? 'text-red-600' : 'text-green-600'
                }`}>
                   {esSalida ? '-' : '+'}{mov.cantidad}
                </td>

                {/* 6. FECHA */}
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                   {formatearFecha(mov.fecha)}
                </td>

                {/* 7. ACCIONES (Detalle y Reembolso) */}
                <td className="px-4 py-4 text-center flex justify-center gap-2 items-center">
                    
                    {mov.transaccionId && (
                        <button
                            onClick={() => onVerDetalle && onVerDetalle(mov.transaccionId!)}
                            title="Ver detalle del comprobante"
                            className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                        >
                            <BsEye size={18} />
                        </button>
                    )}

                    {esSalida && (
                        !totalmenteReembolsado ? (
                            <button
                                onClick={() => onDevolucion && onDevolucion(mov)}
                                title={`Reembolsar (Disponibles: ${mov.cantidad - cantReembolsada})`}
                                className="text-gray-400 hover:text-orange-600 transition-colors p-2 rounded-full hover:bg-orange-50"
                            >
                                <BsArrowCounterclockwise size={18} />
                            </button>
                        ) : (
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full border border-gray-200 cursor-default whitespace-nowrap">
                                Reembolsado
                            </span>
                        )
                    )}
                </td>
              </tr>
            )})}
          </tbody>
        </table>

        {/* ESTADO VACÍO */}
        {!cargando && movimientosFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50">
            <BsClockHistory size={32} className="mx-auto mb-2 text-gray-300" />
            <p>No se encontraron registros.</p>
          </div>
        )}
      </div>

      {/* FOOTER PAGINACIÓN */}
      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-sm text-gray-500">
            Página <span className="font-bold text-gray-800">{paginaActual + 1}</span> de <span className="font-bold text-gray-800">{totalPaginas === 0 ? 1 : totalPaginas}</span>
        </span>
        <div className="flex gap-2">
            <button
                onClick={() => alCambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 0 || cargando}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <BsChevronLeft size={16} />
                Anterior
            </button>
            <button
                onClick={() => alCambiarPagina(paginaActual + 1)}
                disabled={paginaActual >= totalPaginas - 1 || cargando}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                Siguiente
                <BsChevronRight size={16} />
            </button>
        </div>
      </div>
      
    </div>
  );
};