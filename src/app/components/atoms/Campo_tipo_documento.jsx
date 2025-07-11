import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { IoIosArrowDown } from "react-icons/io";
import { BASE_PATH } from '../../utils/constants';

import axios from 'axios';

const CampoTipoDocumento = ({ selectedDocument, onChange, disabled, type }) => {
  const [options, setOptions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDocumentos() {
      try {
        const response = await axios.get(`${BASE_PATH}/api/type?type=`+type);
        setOptions(response.data);
      } catch (err) {
        throw new Error(err.message);
      } finally {
        setLoading(false);
      }
    }

    cargarDocumentos();
  }, []);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e) => {
    const selectedCode = e.target.value;
    const selected = options.find(option => option.code === selectedCode);
    onChange(selected || null);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <select
          id="tipodoc"
          value={selectedDocument?.code || ''}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`bg-white appearance-none peer w-full border rounded-md p-2 focus:outline-none text-sm ${
            isFocused ? 'border-gray-700  border-2 outline-none shadow' : 'border-gray-600'
          }`}
          disabled={disabled || loading}
          required
        >
          {/* <option className="hidden"></option> */}
          <option value={0}>Selecciona un tipo de documento</option>
          {options.map((documento) => (
            <option key={documento.code} value={documento.code}>
              {documento.Title}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <IoIosArrowDown />
        </div>
        <label
          htmlFor='tipodoc'
          className={`absolute left-2 px-1 bg-white ${
            //isFocused || value != 0
            isFocused || (selectedDocument?.code && selectedDocument.code !== '')
              ? '-top-2 max-[1280px]:text-xs text-sm scale-90 transition-all transform origin-left left-2.5' 
              : 'top-2.5 text-sm text-gray-600 pr-[80px]'
          } ${ isFocused ? 'text-gray-700 ': 'text-gray-600'} transition-all duration-200 pointer-events-none`}
        >
          Tipo de documento <span className='pr-2 text-red-500 text-sm'>*</span>
        </label>
      </div>
    </div>
  );
};

export default CampoTipoDocumento;

CampoTipoDocumento.propTypes = {
  selectedDocument: PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  type: PropTypes.string,
};

CampoTipoDocumento.defaultProps = {
  selectedDocument: null,
  disabled: false,
};