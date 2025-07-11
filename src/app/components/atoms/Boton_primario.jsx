import PropTypes from 'prop-types';

export default function Boton_primario({ children , type = "button", disabled = false, onClick, modal = false} ) {
    return (
        <button 
          type={type} 
          disabled={disabled} 
          onClick={onClick}
          className={`max-[1280px]:text-sm 
            ${modal ? 'my-1' : 'max-[1023px]:mt-6 max-[1023px]:mb-4 max-[1280px]:mb-2 max-[1280px]:mt-3 mt-6 mb-2'} w-auto rounded-full py-2 px-8 border border-transparent text-center transition-all shadow-md hover:shadow-sm hover:shadow-orange-500/50 focus:shadow-none active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] overflow-hidden text-bold
            ${disabled ? 'bg-gray-300 opacity-50 pointer-events-none shadow-none text-disabled' : 'bg-orange-600 active:bg-orange-700 text-white'}
          `}>
            {children}
        </button>
    );
}

Boton_primario.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  modal: PropTypes.bool,
};