package com.farmacia.farmacia_api.reportes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class TareaAutomaticaStock {

    @Autowired
    private AlertaStockService alertaStockService;

    @Scheduled(cron = "0 41 14 * * ?")
    public void enviarReporteDiario() {
        try {
            alertaStockService.enviarAlertaStock();
            System.out.println("Reporte enviado correctamente");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}


