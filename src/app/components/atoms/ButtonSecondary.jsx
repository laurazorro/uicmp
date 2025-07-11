import PropTypes from 'prop-types';

export default function ButtonSecondary({ children , type = "button", disabled = false, onClick, modal = false}) {
    return (
        <button
          type={type} 
          disabled={disabled} 
          onClick={onClick}
          className={`max-[1281px]:text-sm ${modal ? 'my-1' : 'max-[1281px]:mt-0 min-[1281px]:mt-2'} w-auto rounded-full py-2 px-8 border text-center transition-all hover:shadow-sm hover:shadow-orange-500/50 focus:shadow-none active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] overflow-hidden text-bold
          ${disabled ? 'opacity-50 border-gray-600 pointer-events-none shadow-none text-gray-600' : 'text-orange-600 border-orange-500'}`}>
            {children}
        </button>
    );
}

ButtonSecondary.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  modal: PropTypes.bool,
};