import { useEffect, useMemo, useState } from "react";

/**
 * Tipo de Movimiento
 */
export interface Movimiento {
  id: number;
  codigoMedicamento: string;
  nombreMedicamento?: string;
  rol: "AUXILIAR" | "FARMACEUTICO" | string;
  usuario: string;
  cantidad: number;
  tipo: "DESPACHO" | "ENTRADA" | "DEVOLUCION" | "BAJA" | string;
  fecha: string;
  numeroLote: string;
  cantidadReembolsada: number; 
  transaccionId?: string; // ✅ Permite buscar por número de comprobante
}

export type EstadoMovimiento = "TODOS" | "DESPACHO" | "ENTRADA" | "DEVOLUCION" | "BAJA" | string;

export const useMovimientos = (vistaActual?: string) => {
  // -------------------------
  // STATE
  // -------------------------
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [estado, setEstado] = useState<EstadoMovimiento>("TODOS");
  const [filtroFecha, setFiltroFecha] = useState<string>("TODOS"); 
  const [filtroUsuario, setFiltroUsuario] = useState<string>("TODOS"); // ✅ NUEVO ESTADO PARA USUARIOS

  const [cargandoMov, setCargando] = useState(false);
  const [errorMov, setError] = useState<string | null>(null);

  // -------------------------
  // CARGAR DATOS (PAGINADOS)
  // -------------------------
  const cargarMovimientos = async (pagina = paginaActual) => {
    try {
      setCargando(true);
      setError(null);

      const usuarioId = localStorage.getItem("usuarioId");
      const rol = localStorage.getItem("rol");

      if (!usuarioId || !rol) return;

      const response = await fetch(
        `http://localhost:8080/api/movimientos?usuarioId=${usuarioId}&rol=${rol}&page=${pagina}&size=25`
      );
      
      if (!response.ok) throw new Error("Error al obtener historial");

      const data = await response.json();
      
      setMovimientos(data.content);
      setTotalPaginas(data.totalPages);
      setPaginaActual(pagina); 

    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el historial.");
    } finally {
      setCargando(false);
    }
  };

  // -------------------------
  // EFFECT
  // -------------------------
  useEffect(() => {
    if (vistaActual === 'MOVIMIENTOS_DESPACHO') {
      cargarMovimientos(0);
    }
  }, [vistaActual]);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 0 && nuevaPagina < totalPaginas) {
        cargarMovimientos(nuevaPagina);
    }
  };

  // ✅ EXTRAEMOS LA LISTA ÚNICA DE AUXILIARES DEL HISTORIAL
  const auxiliaresDisponibles = useMemo(() => {
    const nombres = movimientos
      .filter(m => m.rol.toUpperCase() === "AUXILIAR")
      .map(m => m.usuario);
    return Array.from(new Set(nombres)); // Set elimina los nombres duplicados
  }, [movimientos]);

  // -------------------------
  // FILTRADO (búsqueda + estado + fecha + usuario)
  // -------------------------
  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter((m) => {
      const search = terminoBusqueda.toLowerCase();

      // 1. Búsqueda ampliada (incluye ID de Transacción)
      const coincideBusqueda =
        !terminoBusqueda.trim() ||
        m.codigoMedicamento.toLowerCase().includes(search) ||
        m.usuario.toLowerCase().includes(search) ||
        (m.nombreMedicamento && m.nombreMedicamento.toLowerCase().includes(search)) ||
        (m.numeroLote && m.numeroLote.toLowerCase().includes(search)) ||
        (m.transaccionId && m.transaccionId.toLowerCase().includes(search));

      const coincideEstado =
        estado === "TODOS" || m.tipo === estado;

      // 2. Lógica de filtrado por Fecha
      let coincideFecha = true;
      if (filtroFecha === "HOY") {
        const hoyStr = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
        coincideFecha = m.fecha.startsWith(hoyStr);
      }

      // ✅ 3. Lógica de filtrado por Auxiliar
      const coincideUsuario = filtroUsuario === "TODOS" || m.usuario === filtroUsuario;

      return coincideBusqueda && coincideEstado && coincideFecha && coincideUsuario;
    });
  }, [movimientos, terminoBusqueda, estado, filtroFecha, filtroUsuario]);

  // -------------------------
  // API DEL HOOK
  // -------------------------
  return {
    movimientos,
    movimientosFiltrados,
    terminoBusqueda,
    setTerminoBusqueda,
    estado,
    setEstado,
    filtroFecha,          
    setFiltroFecha,       
    filtroUsuario,          // ✅ EXPORTAMOS
    setFiltroUsuario,       // ✅ EXPORTAMOS
    auxiliaresDisponibles,  // ✅ EXPORTAMOS
    cargandoMov,
    errorMov,
    recargarMovimientos: () => cargarMovimientos(paginaActual),
    paginaActual,
    totalPaginas,
    cambiarPagina
  };
};