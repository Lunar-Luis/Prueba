package com.farmacia.farmacia_api.inventario;
import jakarta.persistence.*;

@Entity
@Table(name = "medicamentos")
public class Medicamento {

    @Id
    private String codigo;

    private String nombre;

    // Este campo estaba llegando null porque quizás no estaba en tu clase Java
    private String descripcion;

    // Este campo existe en tu SQL ('500mg'), hay que mapearlo
    private String concentracion;

    @Column(name = "estado_catalogo")
    private String estadoCatalogo;

    // --- RELACIONES (Llaves Foráneas) ---

    @ManyToOne
    @JoinColumn(name = "marca_id")
    private Marca marca;

    @ManyToOne
    @JoinColumn(name = "linea_id")
    private Linea linea;

    // ¡CAMBIO IMPORTANTE! Relación con la nueva tabla Presentaciones
    @ManyToOne
    @JoinColumn(name = "presentacion_id")
    private Presentacion presentacion;

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getConcentracion() {
        return concentracion;
    }

    public void setConcentracion(String concentracion) {
        this.concentracion = concentracion;
    }

    public String getEstadoCatalogo() {
        return estadoCatalogo;
    }

    public void setEstadoCatalogo(String estadoCatalogo) {
        this.estadoCatalogo = estadoCatalogo;
    }

    public Marca getMarca() {
        return marca;
    }

    public void setMarca(Marca marca) {
        this.marca = marca;
    }

    public Linea getLinea() {
        return linea;
    }

    public void setLinea(Linea linea) {
        this.linea = linea;
    }

    public Presentacion getPresentacion() {
        return presentacion;
    }

    public void setPresentacion(Presentacion presentacion) {
        this.presentacion = presentacion;
    }

    

}