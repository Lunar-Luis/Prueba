package com.farmacia.farmacia_api.despacho;

import java.time.LocalDateTime;

public class MovimientoDTO {
    private Integer id;
    private String codigoMedicamento;
    private String nombreMedicamento;
    private String usuario;
    private String rol;
    private int cantidad;
    private String tipo;
    private LocalDateTime fecha;
    private String numeroLote;
    private String transaccionId;

    // ✅ NUEVO CAMPO
    private int cantidadReembolsada;

    // Constructor Actualizado
    public MovimientoDTO(Integer id, String codigoMedicamento, String nombreMedicamento,
                         String usuario, String rol, int cantidad, String tipo,
                         LocalDateTime fecha, String numeroLote, int cantidadReembolsada, String transaccionId) { // <--- Agregado al final
        this.id = id;
        this.codigoMedicamento = codigoMedicamento;
        this.nombreMedicamento = nombreMedicamento;
        this.usuario = usuario;
        this.rol = rol;
        this.cantidad = cantidad;
        this.tipo = tipo;
        this.fecha = fecha;
        this.numeroLote = numeroLote;
        this.cantidadReembolsada = cantidadReembolsada;
        this.transaccionId = transaccionId;// ✅ Asignar
    }

    // Getters
    public Integer getId() { return id; }
    public String getCodigoMedicamento() { return codigoMedicamento; }
    public String getNombreMedicamento() { return nombreMedicamento; }
    public String getUsuario() { return usuario; }
    public String getRol() { return rol; }
    public int getCantidad() { return cantidad; }
    public String getTipo() { return tipo; }
    public LocalDateTime getFecha() { return fecha; }
    public String getNumeroLote() { return numeroLote; }

    // ✅ Getter Nuevo
    public int getCantidadReembolsada() { return cantidadReembolsada; }

    public String getTransaccionId() {
        return transaccionId;
    }
}