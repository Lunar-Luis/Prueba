import React from 'react';
import { Input } from './Input'; // Reutilizamos tu Input base

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  labelId: string;      // Un ID único para conectar el input con la lista
  sugerencias: any[];   // Lista de objetos { id, nombre } que vienen de la BD
  disabled?: boolean;
}

export const SmartInput: React.FC<Props> = ({ labelId, sugerencias, ...props }) => {
  return (
    <>
      <Input
        {...props}
        list={labelId} // Esto conecta el input con el datalist de abajo
        autoComplete="off"
      />
      {/* Esta lista es invisible, pero el navegador la usa para sugerir */}
      <datalist id={labelId}>
        {sugerencias.map((item, index) => (
          // Usamos item.nombre porque es lo que queremos sugerir
          <option key={`${item.id}-${index}`} value={item.nombre} />
        ))}
      </datalist>
    </>
  );
};