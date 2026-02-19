package com.farmacia.farmacia_api.dashboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired private DashboardService dashboardService;

    // El Equipo Rojo consumirá: http://localhost:8080/api/dashboard/supply-report
    @GetMapping("/supply-report")
    public List<SupplyDTO> getSupplyReport() {
        return dashboardService.obtenerReporteInsumos();
    }
}