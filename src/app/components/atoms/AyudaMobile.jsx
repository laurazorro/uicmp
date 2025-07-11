import { useState, useEffect } from 'react';
import { IoIosClose } from "react-icons/io";
import { FaRegQuestionCircle } from "react-icons/fa";
import PropTypes from 'prop-types';
import {urlLineasAyuda} from "../../utils/constants"
import { ayudaLinksPorFlujo } from "../../utils/ayudaHelper";

export default function AyudaMobile({ flujo }) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const itemsAyuda = ayudaLinksPorFlujo[flujo] || [];

  return (
    <>
      <button
        className="absolute inline-flex top-4 right-4 z-50 items-center justify-center border align-middle select-none text-orange-600 shadow-none hover:shadow-none rounded-md bg-transparent border-transparent text-sm min-w-[108px] min-h-[38px] text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none "
        title="Menú de Ayuda"
        onClick={() => setMenuOpen(true)}
      >
        <span className="m-2 text-xs md:text-sm font-semibold">Ayuda</span><FaRegQuestionCircle className="text-lg"/>
      </button>

      <button
        type="button"
        aria-label="Cerrar menú"
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Menú Off-Canvas */}
      <aside
        className={`fixed top-0 right-0 w-full md:w-1/2 xl:w-1/2 h-full bg-white shadow transform z-50 transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='p-8'>
          <div className='flex justify-end'>
            <button onClick={() => setMenuOpen(false)} title="Cerrar menú de ayuda" className=' shadow-none inline-flex text-orange-600'>
              <span>Cerrar</span><IoIosClose className="w-6 h-6" />
            </button>
          </div>
          <div className='p-4'>
            <p className="text-3xl font-bold pt-6">Ayuda</p>
            <ul className="pt-6 space-y-4">
              {itemsAyuda.map((item, index) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="block text-slate-600 px-2 py-2 hover:text-slate-800 border-b-2 hover:border-slate-800"
                    target="_blank" rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li><a href={urlLineasAyuda} className="block text-slate-600 px-2 py-2 hover:text-slate-800 border-b-2 hover:border-slate-800">Medios de atención</a></li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}

AyudaMobile.propTypes = {
  flujo: PropTypes.string.isRequired,
};