/**
 * Suite de Pruebas - Formulario de Creación de Autor
 * 
 * Esta suite verifica el comportamiento del formulario de creación de autores,
 * incluyendo validaciones, estados del botón y manejo de errores.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CreateAuthorPage from './page';

// Mock del router de Next.js
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock del componente Image de Next.js
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('Formulario de Creación de Autor', () => {
  
  /**
   * A. Prueba de Renderizado Inicial
   * 
   * Verifica que el formulario se renderice correctamente con:
   * - Todos los campos identificables por sus labels
   * - El botón de envío en estado deshabilitado
   */
  describe('A. Renderizado Inicial', () => {
    it('debe renderizar todos los campos del formulario vinculados correctamente con sus labels', () => {
      render(<CreateAuthorPage />);
      
      // Verificar que los campos existen usando getByLabelText (valida la vinculación label-input)
      const nameInput = screen.getByLabelText(/nombre/i);
      const birthDateInput = screen.getByLabelText(/fecha de nacimiento/i);
      const descriptionInput = screen.getByLabelText(/descripción/i);
      const imageInput = screen.getByLabelText(/url de imagen/i);
      
      // Verificar que todos los elementos están en el documento
      expect(nameInput).toBeInTheDocument();
      expect(birthDateInput).toBeInTheDocument();
      expect(descriptionInput).toBeInTheDocument();
      expect(imageInput).toBeInTheDocument();
    });

    it('debe tener el botón de envío deshabilitado inicialmente', () => {
      render(<CreateAuthorPage />);
      
      // Buscar el botón de envío por su texto
      const submitButton = screen.getByRole('button', { name: /crear autor/i });
      
      // Verificar que el botón está deshabilitado
      expect(submitButton).toBeDisabled();
    });
  });

  /**
   * B. Prueba de Uso Incorrecto y Validación
   * 
   * Simula la entrada de datos inválidos y verifica:
   * - Que aparecen mensajes de error específicos
   * - Que el botón permanece deshabilitado
   */
  describe('B. Uso Incorrecto y Validación', () => {
    it('debe mostrar mensajes de error cuando los datos son inválidos y mantener el botón deshabilitado', async () => {
      // Configurar user-event con opciones de tiempo para interacciones asíncronas
      const user = userEvent.setup();
      
      render(<CreateAuthorPage />);
      
      // Obtener los campos
      const nameInput = screen.getByLabelText(/nombre/i);
      const birthDateInput = screen.getByLabelText(/fecha de nacimiento/i);
      const descriptionInput = screen.getByLabelText(/descripción/i);
      const submitButton = screen.getByRole('button', { name: /crear autor/i });
      
      // Escenario 1: Ingresar nombre muy corto (menos de 3 caracteres)
      await user.type(nameInput, 'AB');
      await user.tab(); // Trigger onBlur para activar validación
      
      // Verificar que aparece el mensaje de error
      expect(await screen.findByText(/el nombre debe tener al menos 3 caracteres/i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
      
      // Escenario 2: Ingresar fecha vacía
      await user.click(birthDateInput);
      await user.tab(); // Trigger onBlur
      
      // Verificar mensaje de error de fecha
      expect(await screen.findByText(/la fecha de nacimiento es obligatoria/i)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
      
      // Escenario 3: Ingresar descripción muy corta (menos de 10 caracteres)
      await user.type(descriptionInput, 'Corta');
      await user.tab(); // Trigger onBlur
      
      // Verificar mensaje de error de descripción
      expect(await screen.findByText(/la descripción debe tener al menos 10 caracteres/i)).toBeInTheDocument();
      
      // Verificar que el botón sigue deshabilitado
      expect(submitButton).toBeDisabled();
    });
  });

  /**
   * C. Prueba de Uso Correcto y Habilitación
   * 
   * Simula la entrada de datos válidos y verifica:
   * - Que los mensajes de error desaparecen
   * - Que el botón se habilita
   */
  describe('C. Uso Correcto y Habilitación', () => {
    it('debe limpiar los errores y habilitar el botón cuando todos los datos son válidos', async () => {
      // Configurar user-event para interacciones asíncronas
      const user = userEvent.setup();
      
      render(<CreateAuthorPage />);
      
      // Obtener los campos
      const nameInput = screen.getByLabelText(/nombre/i);
      const birthDateInput = screen.getByLabelText(/fecha de nacimiento/i);
      const descriptionInput = screen.getByLabelText(/descripción/i);
      const submitButton = screen.getByRole('button', { name: /crear autor/i });
      
      // Paso 1: Primero generar errores con datos inválidos
      await user.type(nameInput, 'AB');
      await user.tab();
      
      // Confirmar que hay error inicialmente
      expect(await screen.findByText(/el nombre debe tener al menos 3 caracteres/i)).toBeInTheDocument();
      
      // Paso 2: Corregir con datos válidos
      await user.clear(nameInput);
      await user.type(nameInput, 'Gabriel García Márquez');
      await user.tab();
      
      // Verificar que el error de nombre desapareció (usar queryByText que no falla si no existe)
      expect(screen.queryByText(/el nombre debe tener al menos 3 caracteres/i)).not.toBeInTheDocument();
      
      // Ingresar fecha de nacimiento válida (fecha pasada)
      await user.type(birthDateInput, '1927-03-06');
      await user.tab();
      
      // Verificar que no hay error de fecha
      expect(screen.queryByText(/la fecha de nacimiento es obligatoria/i)).not.toBeInTheDocument();
      
      // Ingresar descripción válida (más de 10 caracteres)
      await user.type(descriptionInput, 'Escritor colombiano, ganador del Premio Nobel de Literatura en 1982.');
      await user.tab();
      
      // Verificar que no hay error de descripción
      expect(screen.queryByText(/la descripción debe tener al menos 10 caracteres/i)).not.toBeInTheDocument();
      
      // Paso 3: Verificar que el botón está habilitado
      expect(submitButton).toBeEnabled();
    });
  });
});
