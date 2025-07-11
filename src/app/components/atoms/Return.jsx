import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";

export default function Return({ url }){
  const [sessionStorageValue, setSessionStorageValue] = useState(null);

  useEffect(()  => {
    const storedValue = sessionStorage.getItem('parameters');
    setSessionStorageValue(storedValue);
  })
  return (
      <div className="relative text-center mt-2">
        <span className='text-orange-600 hover:text-orange-700 inline-flex'>
          <IoArrowBackOutline />
          <Link href={`${url}/?${sessionStorageValue}`} className="font-semibold text-xs ml-2 mb-8"> Regresar</Link>
        </span>
        
      </div>
  );
}

Return.propTypes = {
    url: PropTypes.string.isRequired
};