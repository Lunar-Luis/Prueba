package com.farmacia.farmacia_api.despacho;

import java.util.List;

public class DespachoBatchDTO {
    public Integer usuarioId;
    public List<ItemDespacho> items;

    // Clase interna para los items de la lista
    public static class ItemDespacho {
        // ✅ CAMBIO CLAVE: Ahora exigimos el lote exacto, no el código genérico
        public String numeroLote;
        public int cantidad;
    }
}