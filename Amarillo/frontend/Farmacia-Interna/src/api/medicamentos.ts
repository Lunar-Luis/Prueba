import type { InventarioLote, ItemDespachoPayload } from '../types';
import { API_URL } from '../config/env'; // ✅ Importamos la variable global

// ==========================================
// 1. LECTURA Y BÚSQUEDA (Inventario)
// ==========================================

/**
 * Carga la lista completa de medicamentos.
 */
export const obtenerMedicamentos = async (): Promise<InventarioLote[]> => {
  const rol = localStorage.getItem('rol') || 'AUXILIAR';
  // OJO: Si tu backend pide usuarioId, es buena práctica enviarlo
  const usuarioId = localStorage.getItem('id') || '1'; 
  
  // ✅ Usamos la API_URL global
  const respuesta = await fetch(`${API_URL}/inventario?rol=${rol}&usuarioId=${usuarioId}`);
  if (!respuesta.ok) {
    throw new Error('No se pudo conectar al servidor');
  }
  return await respuesta.json();
};

/**
 * Busca medicamentos en tiempo real por nombre.
 */
export const buscarMedicamentos = async (query: string): Promise<InventarioLote[]> => {
  if (!query || query.length < 2) return [];
  
  const response = await fetch(`${API_URL}/inventario/buscar?q=${query}`);
  if (!response.ok) {
    throw new Error('Error al conectar con el buscador');
  }
  return await response.json();
};

// ==========================================
// 2. CATÁLOGOS (Listas para autocompletado)
// ==========================================

export const obtenerMarcas = async () => {
  const response = await fetch(`${API_URL}/inventario/marcas`);
  if (!response.ok) throw new Error('Error cargando marcas');
  return await response.json();
};

export const obtenerLineas = async () => {
  const response = await fetch(`${API_URL}/inventario/lineas`);
  if (!response.ok) throw new Error('Error cargando líneas');
  return await response.json();
};

export const obtenerPresentaciones = async () => {
  const response = await fetch(`${API_URL}/inventario/presentaciones`);
  if (!response.ok) throw new Error('Error cargando presentaciones');
  return await response.json();
};

// ==========================================
// 3. ESCRITURA Y OPERACIONES
// ==========================================

/**
 * Registra una entrada de mercancía (Nuevo medicamento o Lote).
 */
export const crearMedicamento = async (datos: any): Promise<void> => {
  const response = await fetch(`${API_URL}/inventario/entrada`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Error al guardar el medicamento');
  }
};

/**
 * Ejecuta el despacho masivo de lotes.
 */
export const despacharLote = async (items: ItemDespachoPayload[]): Promise<void> => {
  // Ajustamos para buscar 'id' según lo configuraste en tu authService
  const idGuardado = localStorage.getItem('id') || localStorage.getItem('usuarioId');
  const usuarioIdReal = idGuardado ? parseInt(idGuardado) : 1;
  
  const payload = {
    usuarioId: usuarioIdReal,
    items: items
  };

  const response = await fetch(`${API_URL}/despachos/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const mensajeError = await response.text();
    throw new Error(`Error en el despacho: ${mensajeError}`);
  }
};

/**
 * ✅ NUEVA FUNCIÓN: Dar de Baja (Merma)
 */
export const registrarMerma = async (payload: {
  codigoMedicamento: string;
  numeroLote: string;
  cantidad: number;
  motivo: string;
  usuarioId: number;
}): Promise<void> => {
  const response = await fetch(`${API_URL}/despachos/merma`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al procesar la baja: ${errorText}`);
  }
};