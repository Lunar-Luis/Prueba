export interface InventarioLote {
  medicamentoCodigo: string;
  nombreMedicamento: string;
  descripcion: string;
  marca: string;
  linea: string;
  presentacion: string;
  numeroLote: string;
  fechaVencimiento: string;
  stock: number;
  ubicacion: string;
  estado: 'DISPONIBLE' | 'AGOTADO' | 'DESCONTINUADO' | 'Activo' | 'Descontinuado' | string;
}
/*export interface Medicamento {
  codigo: string;
  nombre: string;
  descripcion: string;
  presentacion: string;
  marca: string;
  linea: string;
  loteSugerido: string;   
  stock: number;
  fechaVencimiento: string; 
  ubicacion?: string; 
  proveedor?: string;

  estado: 'DISPONIBLE' | 'AGOTADO' | 'DESCONTINUADO' | 'Activo' | 'Descontinuado' | string;
}*/

export interface ItemDespachoPayload {
  numeroLote: string;
  cantidad: number;
}