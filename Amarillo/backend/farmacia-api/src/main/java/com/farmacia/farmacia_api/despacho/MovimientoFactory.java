package com.farmacia.farmacia_api.despacho;

import java.time.LocalDateTime;

public class MovimientoFactory {

    public static Movimiento crearMovimiento(String tipo, int cantidad) {
        Movimiento m = new Movimiento();
        m.setFechaHora(LocalDateTime.now());
        m.setCantidad(cantidad);

        // Estandarizamos el diccionario para tener una base de datos limpia
        // y evitar traducciones confusas en el Frontend.
        switch (tipo.toUpperCase()) {
            case "VENTA":
            case "SALIDA_VENTA":
            case "DESPACHO":
                m.setTipo("DESPACHO");
                break;
            case "ENTRADA":
            case "ENTRADA_ALMACEN":
                m.setTipo("ENTRADA");
                break;
            case "AJUSTE":
            case "AJUSTE_INVENTARIO":
            case "MERMA":
            case "BAJA":
                m.setTipo("BAJA");
                break;
            case "DEVOLUCION":
            case "DEVUELTO":
                m.setTipo("DEVOLUCION");
                break;
            default:
                m.setTipo(tipo.toUpperCase());
        }
        return m;
    }
}