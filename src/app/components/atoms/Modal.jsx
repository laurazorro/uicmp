import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PiWarning, PiWarningCircle, PiCheckCircle, PiQuestion } from "react-icons/pi";

import BotonPrimario from './Boton_primario';

export default function Modal({ clase, isOpen, onClose, tipo, title, children, buttonText, onButtonClick }) {
  const [mounted, setMounted] = useState(false);

  const iconos = {
      success: <PiCheckCircle className="text-3xl" />,
      info: <PiQuestion  className="text-xl mt-1" />,
      warning: <PiWarningCircle  className="text-xl" />,
      error: <PiWarning className="text-xl mt-1" />
  };

  const icono = iconos[tipo] || iconos.info;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`relative bg-white rounded-xl py-6 px-4 max-w-sm w-full shadow-lg ${clase}`}>
        {/* Botón cerrar */}
          <button
          type="button"
          className="btn-close absolute top-6 right-4"
          id="btn-alerta"
          onClick={onClose}
          aria-label="Close"
        ></button>
        {/* Header con icono y título */}
        <div className={`flex items-center gap-2 mb-2 `}>
          {icono}
          <h2 className={`text-lg font-medium ${tipo == 'warning' ? 'text-[#634A1A]':''}`}>{title}</h2>
        </div>
        {/* Separador */}
        <div className={`border my-2 ${clase}`}></div>
        {/* Content */}
        <div className="mb-4 text-gray-600 text-sm">
          {children}
        </div>
        {/* Botón */}
        <div className="flex justify-end gap-2">
          <BotonPrimario type="submit" disabled={false} 
          onClick={onButtonClick} modal={true}>{buttonText}</BotonPrimario>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  clase: PropTypes.string,
  isOpen: PropTypes.func,
  onClose: PropTypes.func,
  tipo: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
};