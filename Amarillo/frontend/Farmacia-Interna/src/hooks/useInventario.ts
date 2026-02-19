import { useState, useEffect, useMemo } from 'react';
import type { InventarioLote } from '../types';
import { obtenerMedicamentos, crearMedicamento } from '../api/medicamentos'; // <--- Importamos crearMedicamento

/**
 * Hook para manejar la carga, estado y filtrado del inventario.
 */
export const useInventario = () => {
  // --- Estados ---
  const [medicamentos, setMedicamentos] = useState<InventarioLote[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  // --- Carga de Datos ---
  const cargarMedicamentos = async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await obtenerMedicamentos();
      setMedicamentos(datos);
    } catch (err) {
      console.error("Error al cargar medicamentos:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error inesperado al cargar los medicamentos.");
      }
    } finally {
      setCargando(false);
    }
  };

  // --- (NUEVO) Acción para guardar desde el Modal ---
  const guardarNuevoMedicamento = async (datosFormulario: any) => {
    setCargando(true); // Ponemos la tabla en "cargando" para dar feedback visual
    try {
      await crearMedicamento(datosFormulario);
      // Si todo sale bien, recargamos la lista para ver el nuevo item
      await cargarMedicamentos();
      alert("✅ Medicamento registrado correctamente");
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("❌ Error al guardar: " + (err instanceof Error ? err.message : "Error desconocido"));
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarMedicamentos(); // Carga los datos al iniciar
  }, []);

  // --- Lógica de Filtros y Selección (Memoizada) ---
  const medicamentosFiltrados = useMemo(() => {
    const termino = terminoBusqueda.toLowerCase();

    return medicamentos.filter((item: any) =>
      (item.nombre?.toLowerCase().includes(termino) ?? false) ||
      (item.codigo?.toLowerCase().includes(termino) ?? false) ||
      (item.medicamentoCodigo?.toLowerCase().includes(termino) ?? false) ||
      (item.numeroLote?.toLowerCase().includes(termino) ?? false)
    );
  }, [medicamentos, terminoBusqueda]);


  const medicamentosDespachables = useMemo(() =>
    medicamentos.filter(med => med.stock > 0 && (med.estado === 'Activo' || med.estado === 'DISPONIBLE')),
    [medicamentos]
  );

  return {
    // Estado
    medicamentos,
    medicamentosFiltrados,
    medicamentosDespachables,
    cargando,
    error,
    terminoBusqueda,
    
    // Acciones
    setTerminoBusqueda,
    recargarMedicamentos: cargarMedicamentos,
    guardarNuevoMedicamento // <--- Exportamos la función nueva
  };
};