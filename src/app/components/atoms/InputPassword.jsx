import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import ProgressBar from "../atoms/ProgressBar";

export default function InputPassword({ value, setPassword, disabled, blockAction, label, id })  {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setPassword(e.target.value); // Llama a setPassword con el nuevo valor
  };

  return (
    <div className="w-full">
      <div className="relative">
        <input
          id={id}
          className={`peer w-full border rounded-md p-2 focus:outline-none ${
            isFocused
              ? 'border-gray-700 border-2 outline-none shadow'
              : 'border-gray-600'
          }`}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          minLength={8}
          maxLength={25}
          autoComplete='new-password'
          disabled={disabled}
          placeholder={label}
          required
          onCopy={blockAction}
          onCut={blockAction}
          onPaste={blockAction}
          aria-label={label || 'Contraseña'}
          aria-required="true"
          aria-invalid={value && value.length > 0 ? 'false' : undefined}
          data-testid={label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : 'password-input'}
          onContextMenu={blockAction}
          onDrag={(e) => { e.preventDefault(); }}
          onDragStart={(e) => { e.preventDefault(); }}
          onDragOver={(e) => { e.preventDefault(); }}
          onDragEnd={(e) => { e.preventDefault(); }}
          onDrop={(e) => { e.preventDefault(); }}
        />
        <label
          htmlFor='clavepwd'
          className={`absolute left-2 pr-4 px-1 bg-white ${
            isFocused || !!value
              ? '-top-2 max-[1280px]:text-xs text-sm scale-90 transiton-all transform origin-left left-2.5 bg-white'
              : 'top-2.5 text-sm'
          } ${ isFocused ? 'text-gray-700 ': 'text-gray-600'} transition-all duration-200 pointer-events-none`}
        >
          {label} <span className='pr-2 text-red-500 text-sm'>*</span>
        </label>
        <button
          type="button"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
          style={{
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none'
          }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>

      </div>
      <ProgressBar password={value} />
    </div>
  );
}

InputPassword.propTypes = {
  value: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  disabled: PropTypes.string,
  blockAction: PropTypes.func,
  label: PropTypes.string,
  id: PropTypes.string,
};