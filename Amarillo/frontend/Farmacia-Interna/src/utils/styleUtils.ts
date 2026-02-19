/**
 * src/utils/styleUtils.ts
 */

// 1. Estilo para la fecha de vencimiento (Rojo=Vencido, Amarillo=Próximo, Verde=Bien)
export const obtenerEstiloVencimiento = (fechaVencimiento: string): string => {
  if (!fechaVencimiento) return "text-gray-500";
  
  const hoy = new Date();
  const fechaVence = new Date(fechaVencimiento + 'T00:00:00');
  const diffTiempo = fechaVence.getTime() - hoy.getTime();
  const diasRestantes = Math.ceil(diffTiempo / (1000 * 3600 * 24));

  if (diasRestantes <= 0) return "text-red-600 font-bold"; // Vencido
  if (diasRestantes <= 30) return "text-yellow-600 font-semibold"; // Por vencer
  return "text-green-600"; // Bien
};

// 2. Estilo base para las filas de la tabla
export const obtenerEstiloFila = (): string => {
  return "hover:bg-blue-50"; 
};

// 3. Estilo para el número de stock (Neutro: Azul si hay, Gris si es 0)
export const obtenerEstiloStockAuxiliar = (stock: number): string => {
  return stock > 0
    ? "text-blue-700 font-medium" 
    : "text-gray-400";            
};

// 4. NUEVA: Determina el color del "Badge" de estado (Neutro)
// Recibe el estado administrativo ('Active'/'Descontinuado') y el stock
export const obtenerEstiloEstadoAuxiliar = (estado: string, stock: number): string => {
  // Caso A: Descontinuado (Gris oscuro)
  if (estado === 'Descontinuado' || estado === 'Discontinued') {
    return "bg-gray-200 text-gray-600 border border-gray-300";
  }

  // Caso B: Agotado (Gris claro)
  if (stock === 0) {
    return "bg-gray-100 text-gray-400 border border-gray-200";
  }

  // Caso C: Disponible (Azul informativo - NO verde de éxito)
  return "bg-blue-50 text-blue-700 border border-blue-200";
};

// 5. NUEVA: Determina el TEXTO que va dentro del estado
export const obtenerTextoEstadoAuxiliar = (estado: string, stock: number): string => {
  if (estado === 'Descontinuado' || estado === 'Discontinued') return "DESCONTINUADO";
  if (stock === 0) return "AGOTADO";
  return "DISPONIBLE";
};