import { API_URL } from "../config/env"; // <--- Agrega esta línea
import React, { useState, useEffect } from "react";
import { useInventario } from "../hooks/useInventario";
import { useDispatchCart } from "../hooks/useDispatchCart";
import { MedicamentosTable } from "../components/organisms/MedicamentosTable";
import { DispatchForm } from "../components/organisms/DispatchForm";
import { ConfirmDispatchModal } from "../components/molecules/ConfirmDispatchModal";
import { Sidebar } from "../components/organisms/Sidebar";
import { MovimientosTable } from "../components/organisms/MovimientosTable";
import { useMovimientos } from "../hooks/useMovimientos";
import { BsBoxSeam, BsLayers, BsExclamationTriangle, BsSlashCircle, BsTrophy } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { RecepcionForm } from "../components/organisms/RecepcionForm";
import { RefundModal } from "../components/molecules/RefundModal";
import { DispatchDetailModal } from "../components/molecules/DispatchDetailModal";

export const InventarioPage: React.FC = () => {
  const nombreUsuarioReal = localStorage.getItem("nombre") || "Usuario";
  const navigate = useNavigate();

  const getRolInicial = () => {
    const rolGuardado = localStorage.getItem("rol");
    return rolGuardado
      ? (rolGuardado.toUpperCase() as "FARMACEUTICO" | "AUXILIAR")
      : "AUXILIAR";
  };
  const [rolActual] = useState<"FARMACEUTICO" | "AUXILIAR">(getRolInicial());

  // ✅ CORRECCIÓN CLAVE AQUÍ: Si es Farmacéutico, abre DASHBOARD por defecto.
  const [vistaActual, setVistaActual] = useState(
    getRolInicial() === "FARMACEUTICO" ? "DASHBOARD" : "INVENTARIO",
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [modalReembolsoOpen, setModalReembolsoOpen] = useState(false);
  const [movimientoA_Reembolsar, setMovimientoA_Reembolsar] = useState<any>(null);
  const [procesandoReembolso, setProcesandoReembolso] = useState(false);
  const [transaccionIdDetalle, setTransaccionIdDetalle] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("nombre");
    localStorage.removeItem("usuarioId");
    navigate("/", { replace: true });
  };

  const {
    medicamentos,
    medicamentosFiltrados,
    medicamentosDespachables,
    cargando,
    error,
    terminoBusqueda,
    setTerminoBusqueda,
    recargarMedicamentos,
    guardarNuevoMedicamento,
  } = useInventario();

  const {
    movimientosFiltrados,
    terminoBusqueda: terminoBusquedaMov,
    setTerminoBusqueda: setTerminoBusquedaMov,
    estado,
    setEstado,
    filtroFecha,       
    setFiltroFecha,    
    filtroUsuario,          
    setFiltroUsuario,       
    auxiliaresDisponibles,  
    cargandoMov,
    errorMov,
    paginaActual,
    totalPaginas,
    cambiarPagina,
    recargarMovimientos,
  } = useMovimientos(vistaActual);

  const [topDespachados, setTopDespachados] = useState<any[]>([]);

  useEffect(() => {
    if (vistaActual === "DASHBOARD") {
        recargarMedicamentos(); 
        
        const usuarioId = localStorage.getItem("usuarioId") || "1";
        const rol = localStorage.getItem("rol") || "AUXILIAR";

        fetch(`${API_URL}/movimientos?usuarioId=${usuarioId}&rol=${rol}&page=0&size=1000`)
            .then(res => {
                if (!res.ok) throw new Error("Error al cargar historial para dashboard");
                return res.json();
            })
            .then(data => {
                const movimientos = data.content || [];
                const salidas = movimientos.filter((m: any) => m.tipo === 'DESPACHO' || m.tipo === 'SALIDA');
                
                if (salidas.length === 0) {
                    setTopDespachados([]);
                    return;
                }

                const conteo: Record<string, number> = {};
                salidas.forEach((m: any) => {
                    const nombre = m.nombreMedicamento || "Desconocido";
                    conteo[nombre] = (conteo[nombre] || 0) + m.cantidad;
                });

                const ranking = Object.entries(conteo)
                    .map(([nombre, total]) => ({ nombre, total }))
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 5);
                
                setTopDespachados(ranking);
            })
            .catch(err => {
                console.error("Error calculando top despachos:", err);
                setTopDespachados([]);
            });
    }
  }, [vistaActual]);

  const carrito = useDispatchCart(recargarMedicamentos);

  const abrirModalReembolso = (mov: any) => {
    setMovimientoA_Reembolsar(mov);
    setModalReembolsoOpen(true);
  };

  const ejecutarReembolso = async (cantidad: number) => {
    if (!movimientoA_Reembolsar) return;
    setProcesandoReembolso(true);
    try {
      const usuarioId = localStorage.getItem("usuarioId");
      const response = await fetch(
        `${API_URL}/despachos/devolucion`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            movimientoId: movimientoA_Reembolsar.id,
            cantidad: cantidad,
            usuarioId: usuarioId ? parseInt(usuarioId) : 1,
          }),
        },
      );
      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg);
      }
      alert("✅ Reembolso exitoso.");
      setModalReembolsoOpen(false);
      recargarMovimientos();
    } catch (error: any) {
      alert("Error al procesar reembolso: " + error.message);
    } finally {
      setProcesandoReembolso(false);
    }
  };

  const renderContenido = () => {
    
    if (vistaActual === "DASHBOARD" && rolActual === "FARMACEUTICO") {
      const totalMedicamentos = medicamentos.length;
      const stockTotal = medicamentos.reduce((acc, m) => acc + m.stock, 0);
      const stockCritico = medicamentos.filter(m => m.stock < 20 && m.stock > 0).length;
      const agotados = medicamentos.filter(m => m.stock === 0).length;

      return (
        <div className="animate-fade-in space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Referencias</p>
                      <h3 className="text-3xl font-extrabold text-blue-600 mt-2">
                        {cargando ? "..." : totalMedicamentos}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">Productos registrados</p>
                   </div>
                   <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><BsBoxSeam size={24} /></div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stock Total</p>
                      <h3 className="text-3xl font-extrabold text-indigo-600 mt-2">
                        {cargando ? "..." : stockTotal}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">Unidades físicas</p>
                   </div>
                   <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><BsLayers size={24} /></div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">Críticos</p>
                      <h3 className="text-3xl font-extrabold text-orange-500 mt-2">
                        {cargando ? "..." : stockCritico}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">{"< 20 Unid."}</p>
                   </div>
                   <div className="p-3 bg-orange-50 rounded-xl text-orange-500"><BsExclamationTriangle size={24} /></div>
                </div>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                   <div>
                      <p className="text-xs font-bold text-red-400 uppercase tracking-wider">Agotados</p>
                      <h3 className="text-3xl font-extrabold text-red-600 mt-2">
                        {cargando ? "..." : agotados}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">Stock 0</p>
                   </div>
                   <div className="p-3 bg-red-50 rounded-xl text-red-600"><BsSlashCircle size={24} /></div>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                        <BsTrophy size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Top 5: Medicamentos Más Despachados</h3>
                        <p className="text-xs text-gray-500">Ranking basado en el historial de salidas</p>
                    </div>
                </div>
                <span className="text-xs font-medium bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-100">
                    Mayor Rotación
                </span>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold tracking-wider">
                      <tr>
                         <th className="p-4 w-16 text-center">Rank</th>
                         <th className="p-4">Medicamento</th>
                         <th className="p-4 text-right">Total Despachado</th>
                         <th className="p-4 w-1/3">Barra de Volumen</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {topDespachados.length > 0 ? topDespachados.map((item, index) => {
                         const maxTotal = topDespachados[0].total;
                         const porcentaje = Math.round((item.total / maxTotal) * 100);

                         return (
                             <tr key={index} className="hover:bg-yellow-50/30 transition-colors">
                                <td className="p-4 text-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                        index === 0 ? 'bg-yellow-400 text-white shadow-md' : 
                                        index === 1 ? 'bg-gray-300 text-white' : 
                                        index === 2 ? 'bg-orange-300 text-white' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {index + 1}
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-gray-700">
                                    {item.nombre}
                                </td>
                                <td className="p-4 text-right">
                                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-bold">
                                        {item.total} un.
                                    </span>
                                </td>
                                <td className="p-4 align-middle">
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                        <div 
                                            className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full" 
                                            style={{ width: `${porcentaje}%` }}
                                        ></div>
                                    </div>
                                </td>
                             </tr>
                         );
                      }) : (
                        <tr>
                            <td colSpan={4} className="p-12 text-center text-gray-400 italic bg-gray-50/50 rounded-lg">
                                No hay suficientes datos de despachos para generar el ranking aún.
                            </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      );
    }

    if (vistaActual === "RECEPCION" && rolActual === "FARMACEUTICO") {
      return (
        <RecepcionForm onGuardar={(datos) => guardarNuevoMedicamento(datos)} />
      );
    }

    if (vistaActual === "MOVIMIENTOS_DESPACHO") {
      return (
        <div className="grid grid-cols-1 animate-fade-in h-[calc(100vh-140px)]">
          <MovimientosTable
            movimientosFiltrados={movimientosFiltrados}
            terminoBusqueda={terminoBusquedaMov}
            estado={estado}
            filtroFecha={filtroFecha}               
            filtroUsuario={filtroUsuario}                    
            auxiliaresDisponibles={auxiliaresDisponibles}    
            cargando={cargandoMov}
            error={errorMov}
            alCambiarBusqueda={setTerminoBusquedaMov}
            alCambiarEstado={setEstado}
            alCambiarFiltroFecha={setFiltroFecha}   
            alCambiarFiltroUsuario={setFiltroUsuario}        
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            alCambiarPagina={cambiarPagina}
            onDevolucion={abrirModalReembolso}
            onVerDetalle={(txId) => setTransaccionIdDetalle(txId)}
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:items-start animate-fade-in">
        <div
          className={
            rolActual === "FARMACEUTICO" ? "md:col-span-3" : "md:col-span-2"
          }
        >
          <MedicamentosTable
            medicamentosFiltrados={medicamentosFiltrados}
            medicamentosDespachables={medicamentosDespachables}
            codigosSeleccionados={carrito.codigosSeleccionados}
            terminoBusqueda={terminoBusqueda}
            cargando={cargando}
            error={error}
            alCambiarBusqueda={setTerminoBusqueda}
            alAlternarSeleccion={carrito.alternarSeleccion}
            alSeleccionarTodos={carrito.seleccionarTodos}
            mostrarSeleccion={rolActual === "AUXILIAR"}
          />
        </div>

        {rolActual === "AUXILIAR" && (
          <div className="md:col-span-1">
            <DispatchForm
              medicamentosSeleccionados={medicamentos.filter((m) =>
                carrito.codigosSeleccionados.includes(m.numeroLote),
              )}
              cantidades={carrito.cantidades}
              errores={carrito.erroresDespacho}
              errorGlobal={carrito.errorGlobal}
              despachando={carrito.estaDespachando}
              alCambiarCantidad={carrito.actualizarCantidad}
              alQuitarItem={carrito.alternarSeleccion}
              alLimpiar={carrito.limpiarCarrito}
              alConfirmarDespacho={() => {
                setMostrarConfirmacion(true);
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex text-gray-800">
      <Sidebar
        rol={rolActual}
        nombreUsuario={nombreUsuarioReal}
        vistaActual={vistaActual}
        onCambiarVista={setVistaActual}
        onAbrirModalCrear={() => setIsModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1 ml-64 p-8 transition-all duration-300">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {vistaActual === "DASHBOARD"
                ? "Resumen Gerencial"
                : vistaActual === "MOVIMIENTOS_DESPACHO"
                  ? "Historial de Movimientos"
                  : "Operaciones de Farmacia"}
            </h2>
            <p className="text-sm text-gray-500">
              {rolActual === "FARMACEUTICO"
                ? "Vista de Administrador: Gestión Total del Inventario"
                : "Vista de Auxiliar: Despacho y Consulta"}
            </p>
          </div>
        </div>

        {renderContenido()}
      </main>

      <ConfirmDispatchModal
        isOpen={mostrarConfirmacion}
        medicamentos={medicamentos.filter((m) =>
          carrito.codigosSeleccionados.includes(m.numeroLote),
        )}
        cantidades={carrito.cantidades}
        despachando={carrito.estaDespachando}
        onCancel={() => setMostrarConfirmacion(false)}
        onConfirm={() => {
          carrito.confirmarDespacho(medicamentos);
          setMostrarConfirmacion(false);
        }}
      />

      <RefundModal
        isOpen={modalReembolsoOpen}
        movimiento={movimientoA_Reembolsar}
        procesando={procesandoReembolso}
        onCancel={() => setModalReembolsoOpen(false)}
        onConfirm={ejecutarReembolso}
      />

      <DispatchDetailModal
        isOpen={!!transaccionIdDetalle}
        transaccionId={transaccionIdDetalle}
        onClose={() => setTransaccionIdDetalle(null)}
      />
    </div>
  );
};