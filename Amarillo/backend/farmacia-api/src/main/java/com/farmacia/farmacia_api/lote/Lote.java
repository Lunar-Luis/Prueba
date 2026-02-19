package com.farmacia.farmacia_api.lote;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "lotes")
public class Lote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "numero_lote")
    private String numeroLote;

    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;

    @Column(name = "cantidad_actual")
    private int cantidadActual;

    @Column(name = "estado_sanitario")
    private String estadoSanitario;

    @Column(name = "medicamento_codigo")
    private String medicamentoCodigo;

    // --- CAMPOS NUEVOS PARA LOGÍSTICA ---
    @Column(name = "proveedor")
    private String proveedor; // <--- NUEVO: Para saber el origen (Trazabilidad)

    @Column(name = "ubicacion")
    private String ubicacion;

    // Getters y Setters...


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNumeroLote() {
        return numeroLote;
    }

    public void setNumeroLote(String numeroLote) {
        this.numeroLote = numeroLote;
    }

    public LocalDate getFechaVencimiento() {
        return fechaVencimiento;
    }

    public void setFechaVencimiento(LocalDate fechaVencimiento) {
        this.fechaVencimiento = fechaVencimiento;
    }

    public int getCantidadActual() {
        return cantidadActual;
    }

    public void setCantidadActual(int cantidadActual) {
        this.cantidadActual = cantidadActual;
    }

    public String getEstadoSanitario() {
        return estadoSanitario;
    }

    public void setEstadoSanitario(String estadoSanitario) {
        this.estadoSanitario = estadoSanitario;
    }

    public String getMedicamentoCodigo() {
        return medicamentoCodigo;
    }

    public void setMedicamentoCodigo(String medicamentoCodigo) {
        this.medicamentoCodigo = medicamentoCodigo;
    }

    public String getProveedor() {
        return proveedor;
    }

    public void setProveedor(String proveedor) {
        this.proveedor = proveedor;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

}