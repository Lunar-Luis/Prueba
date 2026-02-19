import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button'; // Asegúrate que la ruta sea correcta
import '@testing-library/jest-dom';

describe('Componente Button', () => {
    
    // TEST 1 (FRONTEND): Verificar que renderiza y responde al click
    it('debe renderizar el texto y manejar el click', () => {
        // 1. Preparar: Creamos una función espía (mock)
        const handleClick = vi.fn();
        
        // 2. Renderizar: Pintamos el botón en el DOM virtual
        render(<Button onClick={handleClick}>Hacer Click</Button>);
        
        // 3. Verificar visual: ¿Está el texto en pantalla?
        const boton = screen.getByText('Hacer Click');
        expect(boton).toBeInTheDocument();
        
        // 4. Actuar: Simulamos un click del usuario
        fireEvent.click(boton);
        
        // 5. Verificar lógica: ¿Se llamó a la función?
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});