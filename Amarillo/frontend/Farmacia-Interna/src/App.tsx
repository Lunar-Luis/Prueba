// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { InventarioPage } from './pages/InventarioPage';
import { PrivateRoute } from './routes/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN – PRIMERA PANTALLA */}
        <Route path="/" element={<Login />} />

        {/* FARMACÉUTICO */}
        <Route
          path="/farmaceutico"
          element={
            <PrivateRoute rolPermitido="farmaceutico">
              <InventarioPage />
            </PrivateRoute>
          }
        />

        {/* AUXILIAR */}
        <Route
          path="/auxiliar"
          element={
            <PrivateRoute rolPermitido="auxiliar">
              <InventarioPage />
            </PrivateRoute>
          }
        />

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </BrowserRouter>
  );
}
