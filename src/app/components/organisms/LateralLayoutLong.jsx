'use client'
import ImagenLateral from '../atoms/Imagen_lateral';
import ImagenSuperior from '../atoms/Imagen_superior';

import PropTypes from 'prop-types';

export default function LateralLayoutLong({ children }) {
  return (
    <div className="flex min-h-screen h-dvh max-w-full flex-col lg:flex-row ">
      <div className="hidden lg:flex w-full lg:w-1/2 bg-gray-100 justify-center items-center p-16">
        <ImagenLateral />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col overflow-y-auto min-[1640px]:place-content-center">
        {/* Imagen superior para responsive */}
        <div className="block lg:hidden w-full bg-gray-100">
          <div className="max-w-sm mx-auto pt-20 pb-4 px-4 flex justify-center">
            <ImagenSuperior />
          </div>
        </div>

        {/* Contenido (formulario) */}
        <div className="w-full bg-white flex justify-center items-center pb-10 lg:pb-0">
          {children}
        </div>
      </div>
    </div>
  );
}

LateralLayoutLong.propTypes = {
  children: PropTypes.node.isRequired
};