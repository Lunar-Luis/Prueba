import React from "react";
import type { InventarioLote } from "../../types";
import {
  obtenerEstiloVencimiento,
  obtenerEstiloFila,
  obtenerEstiloStockAuxiliar,
  obtenerTextoEstadoAuxiliar,
  obtenerEstiloEstadoAuxiliar,
} from "../../utils/styleUtils";

interface Props {
  medicamento: InventarioLote;
  estaSeleccionado: boolean;
  alAlternarSeleccion: () => void;
}

export const MedicamentoTableRow: React.FC<Props> = ({
  medicamento: med,
  estaSeleccionado,
  alAlternarSeleccion,
}) => {
  //console.log("MEDICAMENTO EN FILA:", med);

  return (
    <tr
      className={`border-b transition-colors ${obtenerEstiloFila()} ${
        estaSeleccionado ? "!bg-blue-100" : ""
      }`}
    >
      {/* Checkbox */}
      <td className="p-3">
        <input
          type="checkbox"
          checked={estaSeleccionado}
          onChange={alAlternarSeleccion}
          disabled={med.stock === 0 || med.estado === "Descontinuado"}
          className="h-4 w-4 rounded border-gray-300"
        />
      </td>

      {/* Código */}
      <td className="p-3 text-sm text-gray-700 font-mono">{med.medicamentoCodigo}</td>

      {/* Nombre y Descripción */}
      <td className="p-3 text-sm font-medium text-gray-900">
        <div>{med.nombreMedicamento}</div>
        <div className="text-xs text-gray-500 font-normal">
          {med.descripcion}
        </div>
      </td>

      {/* Presentación */}
      <td className="p-3 text-sm text-gray-700">{med.presentacion}</td>

      {/* Marca y Línea */}
      <td className="p-3 text-sm text-gray-700">
        {med.marca}
        <span className="text-xs text-gray-400 block">({med.linea})</span>
      </td>

      {/* Lote Sugerido */}
      <td className="p-3 text-sm font-mono text-blue-600 font-bold">
        {med.numeroLote}
      </td>

      {/* Vencimiento */}
      <td className={`p-3 text-sm ${obtenerEstiloVencimiento(med.fechaVencimiento)}`}>
        {med.fechaVencimiento || "-"}
      </td>

      {/* Estado */}
      <td className="p-3 text-sm">
        <span
          className={`px-2 py-1 rounded text-xs border ${obtenerEstiloEstadoAuxiliar(
            med.estado,
            med.stock
          )}`}
        >
          {obtenerTextoEstadoAuxiliar(med.estado, med.stock)}
        </span>
      </td>

      {/* Stock */}
      <td className="p-3 text-sm font-medium text-right">
        <span className={obtenerEstiloStockAuxiliar(med.stock)}>
          {med.stock}
        </span>
      </td>
    </tr>
  );
};

