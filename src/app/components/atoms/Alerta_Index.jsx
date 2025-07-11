import PropTypes from 'prop-types';
import { PiWarning, PiWarningCircle, PiCheckCircle, PiQuestion } from "react-icons/pi";

const iconos = {
    success: <PiCheckCircle className="text-xl mt-1" />,
    info: <PiQuestion  className="text-xl mt-1" />,
    warning: <PiWarningCircle  className="text-xl" />,
    error: <PiWarning className="text-xl mt-1" />
};

export default function Alerta_Index( { clase, mostrar, mensaje, cerrar, tipo, titulo} ){

    const icono = iconos[tipo] || iconos.info;

    if (!mostrar) return null;

    return (
      <div
        id="alerta"
        className={`alert alert-dismissible -mt-1 lg:container ${clase}`}
        role="alert"
        style={{ display: mostrar }}
        aria-live="assertive"
      >
        <div className="grid grid-cols-12">
          <div>
            {icono}
          </div>
          <div className="col-span-11">
            <span className={`text-sm font-medium ${tipo == 'warning' ? 'text-[#634A1A]':''}`}>{titulo}<br /></span>
            <span className="text-xs text-gray-700">{mensaje}</span>
          </div>
        </div>
        
        <button
          type="button"
          className="btn-close"
          id="btn-alerta"
          onClick={typeof cerrar === 'function' ? cerrar : undefined}
          aria-label="Close"
        ></button>
      </div>
    );
}

Alerta_Index.propTypes = {
  clase: PropTypes.string,
  mostrar: PropTypes.bool,
  mensaje: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  cerrar: PropTypes.func,
  tipo: PropTypes.string,
  titulo: PropTypes.string
};