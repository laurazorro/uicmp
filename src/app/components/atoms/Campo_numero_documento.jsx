import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IoMdWarning } from "react-icons/io";
export default function Campo_numero_documento({
  min,
  max,
  Alfanumerico,
  disabled,
  onInputChange,
  value,
  blockAction,
  typeDocSelected
}) {
  const pattern = Alfanumerico ? '[0-9A-Za-zÑñ]+' : '[0-9]+';
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e) => {
    let newValue = e.target.value;
    let isValid = true;

    // Validación de longitud
    if (
      newValue.length < min || 
      newValue.length > max || 
      (typeDocSelected == 'cc' && newValue.length == 9) 
    ) {
      setError(`El número de identificación no es válido.`);
      isValid = false;
    } else {
      setError('');
    }

    if (onInputChange) {
      onInputChange(newValue);
    }

    if (isValid === false){
        return;
    }
  };

  const handleInput = (e) => {
    let newValue = e.target.value;

    // Limpieza de caracteres no permitidos
    if (Alfanumerico) {
      newValue = newValue.replace(/[^0-9A-Za-zÑñ]/g, '');
    } else {
      newValue = newValue.replace(/\D/g, '');
    }

    e.target.value = newValue; // Actualiza el valor del input
    handleChange({ target: { value: newValue } }); // Llama a handleChange para validar y actualizar el estado
  };

  const baseClasses = 'peer w-full border text-sm rounded-md p-2 focus:outline-none';
  const bgClass = disabled ? 'bg-neutral-50' : 'bg-white';

  let borderClass = 'border-gray-600';
  if (isFocused && error) {
    borderClass = 'border-red-600 border-2';
  } else if (isFocused) {
    borderClass = 'border-gray-700 border-2';
  }

  const inputClassName = `${baseClasses} ${bgClass} ${borderClass}`;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          id="numdoc"
          className={inputClassName}
          type="text"
          value={value}
          onInput={handleInput}
          pattern={pattern}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          minLength={min}
          maxLength={max}
          autoComplete='off'
          placeholder='Número de documento'
          required
          onCopy={blockAction}
          onCut={blockAction}
          onPaste={blockAction}
          onContextMenu={blockAction}
          onDrag={(e) => { e.preventDefault(); }}
          onDragStart={(e) => { e.preventDefault(); }}
          onDragOver={(e) => { e.preventDefault(); }}
          onDragEnd={(e) => { e.preventDefault(); }}
          onDrop={(e) => { e.preventDefault(); }}
        />
        <label
          htmlFor="numdoc" 
          className={`absolute left-2 px-1 ${
            isFocused || value
              ? '-top-2 max-[1280px]:text-xs text-sm scale-90 transition-all transform origin-left left-2.5 bg-white'
              : 'top-2.5 text-sm'
          }  ${ isFocused ? 'text-gray-700 ': 'text-gray-600'} transition-all duration-200 pointer-events-none
          ${ disabled ? 'bg-neutral-50':'bg-white'}`}
        >
          Número de documento <span className='pr-2 text-red-500 text-sm'>*</span>
        </label>
        {error &&  <p className="text-left flex text-red-600 text-xs mt-1">
          <IoMdWarning className='mr-2' />
          <span>{error}</span>
        </p>}
      </div>
    </div>
  );
}

Campo_numero_documento.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  Alfanumerico: PropTypes.bool.isRequired,
  disabled: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  typeDocSelected: PropTypes.string.isRequired,
  blockAction: PropTypes.func,
};