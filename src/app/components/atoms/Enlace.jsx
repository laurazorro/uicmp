import Link from 'next/link';
import PropTypes from 'prop-types';

export default function Enlace({ children, pagina, clase = 'orange' }) {
  const colors = {
      orange: "text-orange-600 hover:text-orange-700",
      lime: "text-lime-600 hover:text-lime-700",
  };
  return (
      <p className="flex justify-center text-sm">
        <Link href={pagina} className={`font-semibold no-underline ${colors[clase]}`}>
          {children}
        </Link>
      </p>
  );
}

Enlace.propTypes = {
  children: PropTypes.string.isRequired,
  pagina: PropTypes.string.isRequired,
  clase: PropTypes.string,
};