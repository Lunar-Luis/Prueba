//Protege las rutas según rol y estado de autenticación
import React from 'react';
import { Navigate } from 'react-router-dom';
import type { UserRole } from '../types/auth';

interface PrivateRouteProps {
  children: React.ReactNode;
  rolPermitido: UserRole;
}
// Obtenemos el rol guardado en localStorage
export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  rolPermitido,
}) => {
  // Obtenemos el rol y token guardado en localStorage
  const rol = localStorage.getItem('rol') as UserRole | null;
  const token = localStorage.getItem('token');

  // Si no hay token o rol → usuario no está logueado
  // Redirigimos al login con <Navigate>
  if (!token || !rol) {
    return <Navigate to="/" replace />;
  }

  // Si el rol del usuario no coincide con el rol permitido para esta ruta
  // Redirigimos al login o a la página principal
  if (rol !== rolPermitido) {
    return <Navigate to="/" replace />;
  }
  // Si pasa las validaciones, renderizamos el contenido dentro del PrivateRoute
  return <>{children}</>;
};
