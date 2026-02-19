import React from 'react';
import { 
  BsGrid1X2Fill,      // Dashboard
  BsBoxSeam,          // Inventario         
  BsBoxArrowLeft,     // Salir
  BsBuildings,        // Logo
  BsQuestionCircle,   // Ayuda
  BsJournalText,      // Manual/Historial
  BsClockHistory      // Historial
} from "react-icons/bs";

interface Props {
  rol: 'FARMACEUTICO' | 'AUXILIAR';
  nombreUsuario: string;
  vistaActual: string;
  onCambiarVista: (vista: string) => void;
  onAbrirModalCrear: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<Props> = ({ 
  rol, 
  nombreUsuario,
  vistaActual, 
  onCambiarVista, 
  onLogout 
}) => {
  
  const linkClass = (vista: string) => `
    flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all font-medium text-sm
    ${vistaActual === vista 
      ? 'bg-blue-600 text-white shadow-md transform translate-x-1' 
      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}
  `;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-50 shadow-sm font-sans">
      
      {/* 1. BRANDING */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-white">
        <div className="bg-blue-600 text-white p-2 rounded-lg shadow-blue-200 shadow-md">
            <BsBuildings size={20} />
        </div>
        <div>
            <h1 className="font-bold text-gray-800 leading-none text-lg">Farmacia</h1>
            <span className="text-[10px] text-blue-600 font-bold tracking-widest uppercase">Intrahospitalaria</span>
        </div>
      </div>

      {/* 2.1 TARJETA DE TURNO (Solo Auxiliar - Para rellenar espacio visualmente) */}
      {rol === 'AUXILIAR' && (
        <div className="px-4 mt-6">
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg">
                <p className="text-xs font-bold text-blue-800 uppercase mb-1">Turno Activo</p>
                <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>07:00 AM - 01:00 PM</span>
                </div>
            </div>
        </div>
      )}

      {/* 3. MENÚ SCROLLABLE */}
      <nav className="flex-1 px-4 mt-6 space-y-1 overflow-y-auto">
        
        {/* === ZONA OPERATIVA (Común para ambos, pero con enfoque diferente) === */}
        <p className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">Operaciones</p>
        
        {rol === 'FARMACEUTICO' && (
            <div onClick={() => onCambiarVista('DASHBOARD')} className={linkClass('DASHBOARD')}>
                <BsGrid1X2Fill size={18} />
                <span>Dashboard Gerencial</span>
            </div>
        )}

        <div onClick={() => onCambiarVista('INVENTARIO')} className={linkClass('INVENTARIO')}>
            <BsBoxSeam size={18} />
            <span>{rol === 'AUXILIAR' ? 'Despacho y Stock' : 'Inventario General'}</span>
        </div>

        {/* --- CAMBIO: Solo el Auxiliar ve sus movimientos aquí --- */}
        {rol === 'AUXILIAR' && (
            <div onClick={() => onCambiarVista('MOVIMIENTOS_DESPACHO')} className={linkClass('MOVIMIENTOS_DESPACHO')}>
                <BsClockHistory size={18} />
                <span>Mis Movimientos</span>
            </div>
        )}

        {/* === ZONA ADMINISTRATIVA (Solo Jefe) === */}
        {rol === 'FARMACEUTICO' && (
            <>
                <p className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Administración</p>
                
                <div onClick={() => onCambiarVista('RECEPCION')} className={linkClass('RECEPCION')}>
                    <BsBoxSeam size={18} />
                    <span>Recepción de Mercancía</span>
                </div>

                {/* --- CAMBIO: El Jefe ve el historial aquí como "Auditoría" --- */}
                <div onClick={() => onCambiarVista('MOVIMIENTOS_DESPACHO')} className={linkClass('MOVIMIENTOS_DESPACHO')}>
                    <BsClockHistory size={18} />
                    <span>Auditoría de Movimientos</span>
                </div>

            </>
        )}

        {/* GRUPO 3: AYUDA (Para Todos - Rellena espacio) */}
        <p className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Soporte</p>
        
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium text-sm">
            <BsJournalText size={18} />
            <span>Guía de Procedimientos</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-medium text-sm">
            <BsQuestionCircle size={18} />
            <span>Reportar Problema</span>
        </div>

      </nav>

      {/* 4. FOOTER */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/80">
        <div className="flex items-center gap-3 mb-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${rol === 'FARMACEUTICO' ? 'bg-indigo-600' : 'bg-emerald-500'}`}>
                {/* Iniciales dinámicas */}
                {nombreUsuario.substring(0,2).toUpperCase()}
            </div>
            <div className="overflow-hidden">
                {/* ✅ 3. AQUÍ MOSTRAMOS EL NOMBRE REAL */}
                <p className="text-sm font-bold text-gray-700 truncate">{nombreUsuario}</p>
                
                {/* Mostramos el rol abajo en pequeñito */}
                <p className="text-[10px] text-gray-500 truncate capitalize">
                    {rol === 'FARMACEUTICO' ? 'Administrador' : 'Auxiliar'}
                </p>
            </div>
        </div>
        <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 p-2 rounded-lg text-xs font-bold transition-colors border border-transparent hover:border-red-100"
        >
            <BsBoxArrowLeft size={14} />
            <span>Cerrar Sesión</span>
        </button>
      </div>

    </aside>
  );
};