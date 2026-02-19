package com.farmacia.farmacia_api.despacho;

import com.farmacia.farmacia_api.lote.Lote;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos")
public class Movimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String tipo; // "ENTRADA", "VENTA", "DEVUELTO"
    private int cantidad;
    private LocalDateTime fechaHora;
    private Integer usuarioId;

    @ManyToOne
    @JoinColumn(name = "lote_id")
    private Lote lote;

    // NUEVO CAMPO: Lleva la cuenta de cuánto se ha devuelto de este movimiento
    @Column(columnDefinition = "integer default 0")
    private int cantidadReembolsada = 0;

    private String transaccionId;

    // --- CONSTRUCTORES ---
    public Movimiento() {}

    public Movimiento(String tipo, int cantidad, LocalDateTime fechaHora, Lote lote, Integer usuarioId, String transaccionId) {
        this.tipo = tipo;
        this.cantidad = cantidad;
        this.fechaHora = fechaHora;
        this.lote = lote;
        this.usuarioId = usuarioId;
        this.cantidadReembolsada = 0;
        this.transaccionId = transaccionId;
    }

    // --- GETTERS Y SETTERS ---
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public Integer getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }

    public Lote getLote() { return lote; }
    public void setLote(Lote lote) { this.lote = lote; }


    public int getCantidadReembolsada() { return cantidadReembolsada; }
    public void setCantidadReembolsada(int cantidadReembolsada) { this.cantidadReembolsada = cantidadReembolsada; }

    public String getTransaccionId() { return transaccionId; }
    public void setTransaccionId(String transaccionId) { this.transaccionId = transaccionId; }
}