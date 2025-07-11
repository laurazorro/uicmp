const { render, screen, fireEvent } = require('@testing-library/react');
require('@testing-library/jest-dom');
const Boton_primario = require('../app/components/atoms/Boton_primario').default;

describe('Boton_primario', () => {
  it('renders children correctly', () => {
    const onClick = jest.fn();
    render(<Boton_primario onClick={onClick}>Test Button</Boton_primario>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('has correct default type', () => {
    const onClick = jest.fn();
    render(<Boton_primario onClick={onClick}>Test Button</Boton_primario>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Boton_primario onClick={onClick}>Test Button</Boton_primario>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const onClick = jest.fn();
    render(<Boton_primario onClick={onClick} disabled>Test Button</Boton_primario>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('bg-gray-300', 'opacity-50', 'pointer-events-none');
  });

  it('has correct styling when enabled', () => {
    const onClick = jest.fn();
    render(<Boton_primario onClick={onClick}>Test Button</Boton_primario>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-orange-600', 'text-white');
  });
});
