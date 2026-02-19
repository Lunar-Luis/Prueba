package com.farmacia.farmacia_api.inventario;

import jakarta.persistence.*;

@Entity
@Table(name = "lineas")
public class Linea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 50)
    private String nombre;

    // --- CONSTRUCTORES ---
    public Linea() {}

    public Linea(String nombre) {
        this.nombre = nombre;
    }

    // --- GETTERS Y SETTERS ---
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}