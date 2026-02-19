package com.farmacia.farmacia_api.dashboard;

import java.time.LocalDate;

public class SupplyDTO {
    // Campos que el Frontend del Equipo Rojo ESPERA OBLIGATORIAMENTE
    public String id;
    public String name;
    public String category;
    public String area;
    public Integer stock;
    public LocalDate expiryDate;

    // Campos que NO tenemos (Se envían en 0 para no romper su gráfica)
    public Integer minStock;
    public Integer criticalStock;
    public Integer consumptionRate;

    public SupplyDTO(String id, String name, String category, String area,
                     Integer stock, LocalDate expiryDate) {
        this.id = id;
        this.name = name;
        // Si no hay categoría/área, enviamos texto genérico para que se vea algo
        this.category = (category != null) ? category : "General";
        this.area = (area != null) ? area : "Almacén";
        this.stock = (stock != null) ? stock : 0;
        this.expiryDate = expiryDate;

        // VALORES POR DEFECTO (Así su frontend funciona, pero sabe que es 0)
        this.minStock = 0;
        this.criticalStock = 0;
        this.consumptionRate = 0;
    }
}