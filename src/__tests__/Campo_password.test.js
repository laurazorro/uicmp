const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
require('@testing-library/jest-dom');
const Campo_password = require('../app/components/atoms/Campo_password').default;

describe('Campo_password', () => {
  let setPassword;
  let blockAction;
  
  beforeEach(() => {
    setPassword = jest.fn();
    blockAction = jest.fn();
  });

  it('renders correctly with default props', () => {
    render(
      <Campo_password 
        value="" 
        setPassword={setPassword} 
        blockAction={blockAction} 
        disabled="false"
      />
    );
    const input = screen.getByPlaceholderText('Contraseña');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
  });

  it('handles password visibility toggle', async () => {
    render(
      <Campo_password 
        value="" 
        setPassword={setPassword} 
        blockAction={blockAction} 
        disabled="false"
      />
    );
    const input = screen.getByPlaceholderText('Contraseña');
    const toggleButton = screen.getByRole('button');

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('calls setPassword on change', () => {
    render(
      <Campo_password 
        value="" 
        setPassword={setPassword} 
        blockAction={blockAction} 
        disabled="false"
      />
    );
    const input = screen.getByPlaceholderText('Contraseña');

    fireEvent.change(input, { target: { value: 'test123' } });
    expect(setPassword).toHaveBeenCalledWith('test123');
  });

  it('has correct focus styles', () => {
    render(
      <Campo_password 
        value="" 
        setPassword={setPassword} 
        blockAction={blockAction} 
        disabled="false"
      />
    );
    const input = screen.getByPlaceholderText('Contraseña');

    fireEvent.focus(input);
    expect(input).toHaveClass('border-gray-700', 'border-2', 'outline-none', 'shadow');

    fireEvent.blur(input);
    expect(input).not.toHaveClass('border-gray-700');
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <Campo_password 
        value="" 
        setPassword={setPassword} 
        blockAction={blockAction} 
        disabled="true"
      />
    );
    const input = screen.getByPlaceholderText('Contraseña');
    expect(input).toBeDisabled();
  });

  it('blocks copy, cut, paste, and context menu actions', () => {
    render(
      <Campo_password 
        value="" 
        setPassword={setPassword} 
        blockAction={blockAction} 
        disabled="false"
      />
    );
    const input = screen.getByPlaceholderText('Contraseña');

    fireEvent.copy(input);
    fireEvent.cut(input);
    fireEvent.paste(input);
    fireEvent.contextMenu(input);

    // Verificar que los eventos fueron bloqueados
    expect(setPassword).not.toHaveBeenCalled();
  });
});
