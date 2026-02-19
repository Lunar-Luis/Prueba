import { useState } from "react";
import type { InventarioLote, ItemDespachoPayload } from "../types";
import { despacharLote } from "../api/medicamentos";

/**
 * Hook para manejar la lógica del carrito de despacho.
 * @param alDespacharConExito - Callback que se ejecuta si el despacho es exitoso.
 */
export const useDispatchCart = (alDespacharConExito: () => void) => {
  // ✅ AHORA GUARDAMOS EL 'numeroLote' EN LUGAR DEL CÓDIGO GENÉRICO
  const [codigosSeleccionados, setCodigosSeleccionados] = useState<string[]>(
    []
  );
  const [cantidades, setCantidades] = useState<{ [key: string]: string }>({});
  const [erroresDespacho, setErroresDespacho] = useState<{
    [key: string]: string;
  }>({});
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);
  const [estaDespachando, setEstaDespachando] = useState(false);

  // --- Manejadores de Eventos ---

  const alternarSeleccion = (numeroLote: string) => {
    setCodigosSeleccionados((prev) =>
      prev.includes(numeroLote)
        ? prev.filter((c) => c !== numeroLote)
        : [...prev, numeroLote]
    );
    // Limpiamos errores al modificar
    setErroresDespacho({});
    setErrorGlobal(null);
  };

  const seleccionarTodos = (
    e: React.ChangeEvent<HTMLInputElement>,
    lista: InventarioLote[]
  ) => {
    if (e.target.checked) {
      // ✅ MAPEAMOS AL NUMERO DE LOTE
      const nuevosLotes = lista.map((m) => m.numeroLote);
      setCodigosSeleccionados(nuevosLotes);
    } else {
      setCodigosSeleccionados([]);
    }
  };

  const actualizarCantidad = (numeroLote: string, valor: string) => {
    setCantidades((prev) => ({
      ...prev,
      [numeroLote]: valor,
    }));
    // Limpia el error para ese item
    if (erroresDespacho[numeroLote]) {
      setErroresDespacho((prev) => {
        const nuevosErrores = { ...prev };
        delete nuevosErrores[numeroLote];
        return nuevosErrores;
      });
    }
    setErrorGlobal(null);
  };

  const limpiarCarrito = () => {
    setCodigosSeleccionados([]);
    setCantidades({});
    setErroresDespacho({});
    setErrorGlobal(null);
  };

  // --- Manejador de Despacho ---

  const confirmarDespacho = async (
    inventarioCompleto: InventarioLote[]
  ) => {
    setEstaDespachando(true);
    setErroresDespacho({});
    setErrorGlobal(null);

    const nuevosErrores: { [key: string]: string } = {};
    let hayErrorLocal = false;
    
    // Validación local
    const itemsParaDespachar = codigosSeleccionados
      .map((numeroLote) => {
        // ✅ BUSCAMOS POR NUMERO DE LOTE
        const med = inventarioCompleto.find((m) => m.numeroLote === numeroLote);
        const cantidadStr = cantidades[numeroLote] || "";
        const cantidad = parseInt(cantidadStr);

        if (!med) return null;

        if (isNaN(cantidad) || cantidad <= 0) {
          nuevosErrores[numeroLote] = "Cantidad inválida.";
          hayErrorLocal = true;
        } else if (cantidad > med.stock) {
          nuevosErrores[numeroLote] = "Excede stock.";
          hayErrorLocal = true;
        }

        // ✅ CAMBIO CRÍTICO: Enviamos 'numeroLote' al backend en lugar de 'codigo'
        return { numeroLote, cantidad };
      })
      .filter((item): item is ItemDespachoPayload => item !== null);

    setErroresDespacho(nuevosErrores);

    if (hayErrorLocal || itemsParaDespachar.length === 0) {
      setEstaDespachando(false);
      if (itemsParaDespachar.length === 0 && !hayErrorLocal) {
        setErrorGlobal("No hay items válidos para despachar.");
      }
      return;
    }

    // Llamada a la API
    try {
      await despacharLote(itemsParaDespachar);
      limpiarCarrito();
      alDespacharConExito();
    } catch (error) {
      console.error("Error al despachar:", error);
      setErrorGlobal(
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado al procesar el despacho."
      );
    } finally {
      setEstaDespachando(false);
    }
  };

  return {
    // Estado
    codigosSeleccionados,
    cantidades,
    erroresDespacho,
    errorGlobal,
    estaDespachando,

    // Acciones
    alternarSeleccion,
    seleccionarTodos,
    actualizarCantidad,
    limpiarCarrito,
    confirmarDespacho,
  };
};