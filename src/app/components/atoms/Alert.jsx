import PropTypes from 'prop-types';
import { PiWarning, PiWarningCircle, PiCheckCircle, PiQuestion  } from "react-icons/pi";

const iconos = {
    success: <PiCheckCircle className="text-xl mt-1" />,
    info: <PiQuestion  className="text-xl mt-1" />,
    warning: <PiWarningCircle  className="text-xl" />,
    error: <PiWarning className="text-xl mt-1" />,
};

export default function Alert( { clase, mensaje, tipo} ){

    const icono = iconos[tipo] || iconos.info;

    return (
      <div
        id="alerta"
        className={`alert alert-dismissible mt-2 lg:container ${clase}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="grid grid-cols-12">
          <div>
            {icono}
          </div>
          <div className="col-span-11">
            <span className="text-xs text-gray-700">{mensaje}</span>
          </div>
        </div>
      </div>
    );
}

Alert.propTypes = {
  clase: PropTypes.string,
  mensaje: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  tipo: PropTypes.string,
};