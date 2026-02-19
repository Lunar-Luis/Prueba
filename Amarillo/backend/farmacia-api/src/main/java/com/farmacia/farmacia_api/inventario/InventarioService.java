package com.farmacia.farmacia_api.inventario;

import com.farmacia.farmacia_api.lote.Lote;
import com.farmacia.farmacia_api.lote.LoteRepository;
import com.farmacia.farmacia_api.despacho.Movimiento;
import com.farmacia.farmacia_api.despacho.MovimientoFactory;
import com.farmacia.farmacia_api.despacho.MovimientoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class InventarioService {

    @Autowired private MedicamentoRepository medRepo;
    @Autowired private LoteRepository loteRepo;
    @Autowired private MovimientoRepository movimientoRepository;

    @Autowired private MarcaRepository marcaRepository;
    @Autowired private LineaRepository lineaRepository;
    @Autowired private PresentacionRepository presentacionRepository;

    public List<InventarioLoteDTO> obtenerInventarioPorLote(boolean incluirVencidos) {

        List<Lote> lotes;

        if (incluirVencidos) {
            // ✅ CAMBIO 1: Pasamos -1 para que el Jefe vea TODO, incluso lo que tiene stock 0
            lotes = loteRepo.findByEstadoSanitarioAndCantidadActualGreaterThan(
                    "DISPONIBLE", -1
            );
        } else {
            // El Auxiliar sigue viendo solo lo válido (> 0 y no vencido)
            lotes = loteRepo
                    .findByEstadoSanitarioAndCantidadActualGreaterThanAndFechaVencimientoAfter(
                            "DISPONIBLE", 0, LocalDate.now()
                    );
        }

        List<InventarioLoteDTO> resultado = new ArrayList<>();

        for (Lote lote : lotes) {
            Medicamento med = medRepo.findById(lote.getMedicamentoCodigo()).orElse(null);
            if (med == null) continue;

            InventarioLoteDTO dto = new InventarioLoteDTO();
            dto.descripcion = (med.getDescripcion() != null && !med.getDescripcion().isEmpty()) ? med.getDescripcion() : "";
            dto.medicamentoCodigo = med.getCodigo();
            dto.nombreMedicamento = med.getNombre();
            dto.marca = med.getMarca() != null ? med.getMarca().getNombre() : "-";
            dto.linea = med.getLinea() != null ? med.getLinea().getNombre() : "-";

            String nombrePresentacion = med.getPresentacion() != null ? med.getPresentacion().getNombre() : "";
            String concentracion = med.getConcentracion() != null ? med.getConcentracion() : "";
            if (!nombrePresentacion.isEmpty() && !concentracion.isEmpty()) {
                dto.presentacion = nombrePresentacion + " " + concentracion;
            } else if (!nombrePresentacion.isEmpty()) {
                dto.presentacion = nombrePresentacion;
            } else if (!concentracion.isEmpty()) {
                dto.presentacion = concentracion;
            } else {
                dto.presentacion = "-";
            }

            dto.numeroLote = lote.getNumeroLote();
            dto.fechaVencimiento = lote.getFechaVencimiento();
            dto.stock = lote.getCantidadActual();
            dto.ubicacion = lote.getUbicacion();

            // ✅ CAMBIO 2: Prioridad de Etiquetas (Primero verificamos si venció, luego si se agotó)
            if ("DESCONTINUADO".equals(med.getEstadoCatalogo())) {
                dto.estado = "DESCONTINUADO";
            }
            else if (lote.getFechaVencimiento() != null && lote.getFechaVencimiento().isBefore(LocalDate.now())) {
                dto.estado = "VENCIDO";
            }
            else if (lote.getCantidadActual() == 0) {
                dto.estado = "AGOTADO";
            }
            else {
                dto.estado = "DISPONIBLE";
            }

            resultado.add(dto);
        }

        return resultado;
    }


    public List<Medicamento> buscarPorNombre(String consulta) {
        return medRepo.findByNombreContainingIgnoreCase(consulta);
    }

    @Transactional
    public Medicamento registrarEntrada(RecepcionDTO dto) {

        String codigo = dto.getCodigo().trim().toUpperCase();
        String nombre = dto.getNombre().trim();

        // Manejo de nulos
        String marcaNombre = dto.getMarca() != null ? dto.getMarca().trim().toUpperCase() : "GENERICO";
        String lineaNombre = dto.getLinea() != null ? dto.getLinea().trim().toUpperCase() : "GENERAL";

        String formaFarmaceuticaNombre = dto.getFormaFarmaceutica() != null ? dto.getFormaFarmaceutica().trim().toUpperCase() : "UNIDAD";
        String descripcion = dto.getDescripcion() != null ? dto.getDescripcion() : "";
        String concentracion = dto.getConcentracion() != null ? dto.getConcentracion() : "";

        Medicamento medicamento = medRepo.findById(codigo).orElse(null);

        if (medicamento == null) {
            System.out.println("🆕 Registrando medicamento: " + nombre);
            medicamento = new Medicamento();
            medicamento.setCodigo(codigo);
            medicamento.setNombre(nombre);

            medicamento.setDescripcion(descripcion);
            medicamento.setConcentracion(concentracion);
            medicamento.setEstadoCatalogo("ACTIVO");

            Marca marca = marcaRepository.findByNombre(marcaNombre)
                    .orElseGet(() -> marcaRepository.save(new Marca(marcaNombre)));
            medicamento.setMarca(marca);

            Linea linea = lineaRepository.findByNombre(lineaNombre)
                    .orElseGet(() -> lineaRepository.save(new Linea(lineaNombre)));
            medicamento.setLinea(linea);

            Presentacion presentacion = presentacionRepository.findByNombre(formaFarmaceuticaNombre)
                    .orElseGet(() -> presentacionRepository.save(new Presentacion(formaFarmaceuticaNombre)));
            medicamento.setPresentacion(presentacion);

            medicamento = medRepo.save(medicamento);
        }

        // --- CREAR LOTE ---
        Lote nuevoLote = new Lote();
        nuevoLote.setNumeroLote(dto.getLote());
        nuevoLote.setFechaVencimiento(dto.getVencimiento());
        nuevoLote.setCantidadActual(dto.getCantidad());
        nuevoLote.setEstadoSanitario("DISPONIBLE");
        nuevoLote.setUbicacion(dto.getUbicacion());
        nuevoLote.setProveedor(dto.getProveedor());
        nuevoLote.setMedicamentoCodigo(medicamento.getCodigo());

        loteRepo.save(nuevoLote);

        // --- REGISTRAR MOVIMIENTO ---
        Movimiento entrada = MovimientoFactory.crearMovimiento("ENTRADA", dto.getCantidad());
        entrada.setLote(nuevoLote);
        entrada.setUsuarioId(dto.getUsuarioId() != null ? dto.getUsuarioId() : 1);

        movimientoRepository.save(entrada);

        return medicamento;
    }
}