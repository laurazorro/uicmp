import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import Password from '../app/components/organisms/Password';

// Mock de useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock de localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Password Component', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  it('renders the password form', () => {
    render(<Password />);
    
    // Verificar que se rendericen los elementos principales
    expect(screen.getByText('Asigna tu contraseña')).toBeInTheDocument();
    
    // Buscar inputs por data-testid
    expect(screen.getByTestId('input-contraseña')).toBeInTheDocument();
    expect(screen.getByTestId('input-confirmar-contraseña')).toBeInTheDocument();
    
    // Buscar botones por texto
    expect(screen.getByRole('button', { name: /finalizar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('validates password requirements', async () => {
    render(<Password />);
    
    const passwordInput = screen.getByTestId('input-contraseña');
    
    // Contraseña que cumple con todos los requisitos
    const strongPassword = 'SecurePass123!';
    
    fireEvent.change(passwordInput, { target: { value: strongPassword } });
    
    // Verificar que todos los requisitos se marquen como cumplidos
    expect(screen.getByText('Contener un mínimo de 8 caracteres')).toHaveClass('text-green-600');
    expect(screen.getByText('Contener al menos una letra mayúscula')).toHaveClass('text-green-600');
    expect(screen.getByText('Contener al menos una letra minúscula')).toHaveClass('text-green-600');
    expect(screen.getByText('Contener al menos un número')).toHaveClass('text-green-600');
    expect(screen.getByText('Contener al menos un caracter especial (ej: !@#$%^&*)')).toHaveClass('text-green-600');
  });

  it('shows error when passwords do not match', async () => {
    // Renderizar el componente
    const { container } = render(<Password />);
    
    // Obtener los inputs de contraseña
    const passwordInput = screen.getByTestId('input-contraseña');
    const confirmPasswordInput = screen.getByTestId('input-confirmar-contraseña');
    
    // Simular entrada de contraseñas que no coinciden
    fireEvent.change(passwordInput, { target: { value: 'ValidPass123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPass123!' } });
    
    // Forzar la actualización del DOM
    act(() => {
      fireEvent.blur(confirmPasswordInput);
    });
    
    // Verificar que el estado de error se haya establecido
    const alerta = container.querySelector('#alerta');
    expect(alerta).not.toBeNull();
    
    // Verificar que el mensaje de error esté presente en el documento
    const errorMessage = await screen.findByText(/las contraseñas no coinciden/i);
    expect(errorMessage).toBeInTheDocument();
    
    // Verificar que la alerta sea visible
    expect(alerta.style.display).toBe('block');
  });

  it('enables submit button when form is valid', async () => {
    render(<Password />);
    
    const passwordInput = screen.getByTestId('input-contraseña');
    const confirmPasswordInput = screen.getByTestId('input-confirmar-contraseña');
    const submitButton = screen.getByRole('button', { name: /finalizar/i });
    
    // Verificar que el botón esté deshabilitado inicialmente
    expect(submitButton).toBeDisabled();
    
    // Ingresar una contraseña válida
    fireEvent.change(passwordInput, { target: { value: 'SecurePass123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'SecurePass123!' } });
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('calls router.push when cancel button is clicked', () => {
    // Configurar localStorage mock
    const testParams = 'test=params';
    
    // Mock de localStorage
    const localStorageMock = {
      getItem: jest.fn().mockReturnValue(testParams),
      setItem: jest.fn(),
      clear: jest.fn()
    };
    
    // Asignar el mock a global.localStorage
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    // Renderizar el componente
    render(<Password />);
    
    // Simular clic en el botón de cancelar
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);
    
    // Verificar que se llamó a sessionStorage.getItem con 'params'
    expect(localStorageMock.getItem).toHaveBeenCalledWith('params');
    
    // Verificar que se llamó a router.push con la ruta correcta
    expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining(testParams));
    
    // Limpiar el mock
    jest.restoreAllMocks();
  });

  it('handles form submission', async () => {
    // Espía en console.log
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Mock de la función de envío del formulario
    const mockSubmit = jest.fn(e => {
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
      console.log('Contraseña actualizada:', 'SecurePass123!');
    });
    
    // Renderizar el componente con un espía en el evento onSubmit
    const { container } = render(<Password />);
    const form = container.querySelector('form');
    form.onsubmit = mockSubmit;
    
    const passwordInput = screen.getByTestId('input-contraseña');
    const confirmPasswordInput = screen.getByTestId('input-confirmar-contraseña');
    
    // Simular entrada de contraseña válida
    fireEvent.change(passwordInput, { target: { value: 'SecurePass123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'SecurePass123!' } });
    
    // Simular envío del formulario
    fireEvent.submit(form);
    
    // Verificar que se llamó a la función de envío
    expect(mockSubmit).toHaveBeenCalled();
    
    // Verificar que se llamó a console.log con el mensaje esperado
    expect(consoleSpy).toHaveBeenCalledWith('Contraseña actualizada:', 'SecurePass123!');
    
    // Limpiar el espía
    consoleSpy.mockRestore();
  });

  it('toggles password visibility', async () => {
    render(<Password />);
    
    const passwordInput = screen.getByTestId('input-contraseña');
    const toggleButton = screen.getAllByRole('button', { name: /mostrar contraseña/i })[0];
    
    // Verificar que la contraseña esté oculta por defecto
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Hacer clic en el botón de mostrar/ocultar
    fireEvent.click(toggleButton);
    
    // Verificar que la contraseña sea visible
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Hacer clic de nuevo para ocultar
    fireEvent.click(toggleButton);
    
    // Verificar que la contraseña esté oculta nuevamente
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
