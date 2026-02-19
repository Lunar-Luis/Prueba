package com.farmacia.farmacia_api.reportes;

import com.farmacia.farmacia_api.inventario.Medicamento;
import com.farmacia.farmacia_api.inventario.MedicamentoRepository;
import com.farmacia.farmacia_api.lote.Lote;
import com.farmacia.farmacia_api.lote.LoteRepository;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.io.ByteArrayOutputStream;

import com.lowagie.text.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@Service
public class AlertaStockService {
    @Autowired
    private LoteRepository loteRepo;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private MedicamentoRepository medicamentoRepository;

    // Define aquí el stock mínimo de alerta
    private final int STOCK_MINIMO = 999;

    public void enviarAlertaStock() throws Exception {
        // Obtener todos los lotes disponibles
        List<Lote> lotes = loteRepo.findByEstadoSanitarioAndCantidadActualGreaterThan(
                "DISPONIBLE", 0
        );

        List<Lote> lotesValidos = lotes.stream()
                .filter(l -> !l.getFechaVencimiento().isBefore(LocalDate.now()))
                .collect(Collectors.toList());

        // Filtrar
        Map<String, Integer> stockPorMedicamento = lotesValidos.stream()
                .collect(Collectors.groupingBy(
                        Lote::getMedicamentoCodigo,
                        Collectors.summingInt(Lote::getCantidadActual)
                ));

        Map<String, Integer> bajoStock = stockPorMedicamento.entrySet().stream()
                .filter(e -> e.getValue() <= STOCK_MINIMO)
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue
                ));

        if (bajoStock.isEmpty()) return;

        // Generar PDF
        byte[] pdf = generarPdf(bajoStock);
        enviarCorreo(pdf);
    }

    private byte[] generarPdf(Map<String, Integer> bajoStock) throws Exception {

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, out);

        document.open();
        document.add(new Paragraph("Reporte de Medicamentos con Bajo Stock"));
        document.add(new Paragraph("Fecha: " + LocalDate.now()));
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(2);
        table.addCell("Medicamento");
        table.addCell("Stock Total");

        for (Map.Entry<String, Integer> entry : bajoStock.entrySet()) {

            String codigo = entry.getKey();
            Integer stock = entry.getValue();

            String nombre = medicamentoRepository.findById(codigo)
                    .map(Medicamento::getNombre)
                    .orElse("DESCONOCIDO");

            table.addCell(nombre);
            table.addCell(stock.toString());
        }

        document.add(table);
        document.close();

        return out.toByteArray();
    }


    private void enviarCorreo(byte[] pdf) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom("eliusalazar2002@gmail.com");
        helper.setTo("eliusalazar2002@gmail.com");
        helper.setSubject("Alerta: Medicamentos con Bajo Stock");
        helper.setText("Se adjunta el reporte de medicamentos con bajo stock.");

        helper.addAttachment("reporte_bajo_stock.pdf", new ByteArrayResource(pdf));

        mailSender.send(message);
    }
}
