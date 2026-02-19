package com.farmacia.farmacia_api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

// Importaciones estáticas para que el código sea legible
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
class FarmaciaE2ETest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testDashboardReporteCompleto() throws Exception {
        /*
         * ESTE ES EL TEST SUPREMO:
         * 1. Llama a la URL real que usa el Equipo Rojo
         * 2. Verifica que el servidor responda (Status 200)
         * 3. Verifica que entregue JSON
         * 4. Verifica que sea una lista (Array)
         */
        mockMvc.perform(get("/api/dashboard/supply-report")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()) // ¿Respondió 200 OK?
                .andExpect(content().contentType(MediaType.APPLICATION_JSON)) // ¿Es JSON?
                .andExpect(jsonPath("$").isArray()); // ¿Es una lista []?
    }
}