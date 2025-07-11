import PropTypes from "prop-types";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function Paginador({ totalPaginas, paginaActual, setPaginaActual }) {
  return (
    <div className="flex justify-around items-center max-[1023px]:mt-4 max-[1290px]:mt-0 mt-6 mb-2">
      <button
        className="text-sm text-orange-600 hover:underline disabled:text-gray-400"
        onClick={() => setPaginaActual((prev) => Math.max(1, prev - 1))}
        disabled={paginaActual === 1}
      >
        <IoIosArrowBack className="text-xl" />
      </button>

      <div className="flex justify-center items-center gap-2 flex-wrap">
        {Array.from({ length: totalPaginas }, (_, i) => {
          const numero = i + 1;
          const activo = numero === paginaActual;
          return (
            <button
              key={numero}
              onClick={() => setPaginaActual(numero)}
              className={`w-6 h-6 rounded-full text-xs font-medium transition ${
                activo
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {numero}
            </button>
          );
        })}
      </div>

      <button
        className="text-sm text-orange-600 hover:underline disabled:text-gray-400"
        onClick={() => setPaginaActual((prev) => Math.min(totalPaginas, prev + 1))}
        disabled={paginaActual === totalPaginas}
      >
        <IoIosArrowForward className="text-xl" />
      </button>
    </div>
  );
}

Paginador.propTypes = {
  paginaActual: PropTypes.number.isRequired,
  totalPaginas: PropTypes.number.isRequired,
  setPaginaActual: PropTypes.func.isRequired,
};