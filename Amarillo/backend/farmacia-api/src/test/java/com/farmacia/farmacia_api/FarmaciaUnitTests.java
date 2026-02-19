package com.farmacia.farmacia_api;

import com.farmacia.farmacia_api.dashboard.SupplyDTO;
import com.farmacia.farmacia_api.inventario.Medicamento;
import com.farmacia.farmacia_api.lote.Lote;
import com.farmacia.farmacia_api.usuarios.LoginDTO;
import com.farmacia.farmacia_api.usuarios.Usuario;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import java.time.LocalDate;

class FarmaciaUnitTests {

    // --- PRUEBAS DE LOGICA EN DTOs (Lo más crítico del Dashboard) ---

    @Test
    void test1_SupplyDTONoDebeTenerValoresNulos() {
        // Probamos que tu constructor rellene con ceros los nulos
        SupplyDTO dto = new SupplyDTO("1", "Aspirina", "Farma", "A1", null, LocalDate.now());
        Assertions.assertEquals(0, dto.stock, "El stock nulo debería convertirse en 0");
    }

    @Test
    void test2_SupplyDTOAsignaCategoriaGeneralSiEsNula() {
        // Si no hay categoría, el sistema no debe explotar, debe decir "General"
        SupplyDTO dto = new SupplyDTO("1", "Aspirina", null, "A1", 10, LocalDate.now());
        Assertions.assertEquals("General", dto.category);
    }

    @Test
    void test3_SupplyDTOAsignaAlmacenSiAreaEsNula() {
        //
        SupplyDTO dto = new SupplyDTO("1", "Aspirina", "Farma", null, 10, LocalDate.now());
        Assertions.assertEquals("Almacén", dto.area);
    }

    @Test
    void test4_SupplyDTOInicializaCamposFaltantesEnCero() {
        //
        SupplyDTO dto = new SupplyDTO("1", "Test", "Cat", "Area", 5, LocalDate.now());
        // Estos campos no los pasamos al constructor, pero deben existir en 0
        Assertions.assertEquals(0, dto.minStock);
        Assertions.assertEquals(0, dto.consumptionRate);
    }

    // --- PRUEBAS DE ENTIDADES (Inventario y Lotes) ---

    @Test
    void test5_LoteDetectaFechaVencida() {
        Lote lote = new Lote();
        // Simulamos una fecha de ayer
        lote.setFechaVencimiento(LocalDate.now().minusDays(1));

        boolean estaVencido = lote.getFechaVencimiento().isBefore(LocalDate.now());
        Assertions.assertTrue(estaVencido, "Debe detectar que la fecha ya pasó");
    }

    @Test
    void test6_LoteAceptaFechaFutura() {
        Lote lote = new Lote();
        lote.setFechaVencimiento(LocalDate.now().plusYears(1));

        boolean estaVigente = lote.getFechaVencimiento().isAfter(LocalDate.now());
        Assertions.assertTrue(estaVigente, "Debe aceptar fechas futuras como válidas");
    }

    @Test
    void test7_MedicamentoGuardaCodigoCorrectamente() {
        // Prueba básica de integridad de datos
        Medicamento med = new Medicamento();
        med.setCodigo("MED-999");
        Assertions.assertEquals("MED-999", med.getCodigo());
    }

    // --- PRUEBAS DE USUARIOS Y SEGURIDAD ---

    @Test
    void test8_UsuarioPuedeTenerRol() {
        Usuario usuario = new Usuario();
        usuario.setRol("FARMACEUTICO");
        Assertions.assertEquals("FARMACEUTICO", usuario.getRol());
    }

    @Test
    void test9_LoginDTOGuardaCredenciales() {
        //
        LoginDTO login = new LoginDTO();
        login.setNombreUsuario("admin");
        login.setPassword("1234");

        Assertions.assertEquals("admin", login.getNombreUsuario());
        Assertions.assertEquals("1234", login.getPassword());
    }

    @Test
    void test10_SupplyDTOMapeaNombreCorrectamente() {
        // Confirmar que el dato más importante (Nombre) no se pierda
        String nombreEsperado = "Ibuprofeno 500mg";
        SupplyDTO dto = new SupplyDTO("1", nombreEsperado, "Farma", "A1", 10, LocalDate.now());
        Assertions.assertEquals(nombreEsperado, dto.name);
    }
}