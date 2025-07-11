import PropTypes from 'prop-types';
import Link from "next/link";

export default function LinkInLine({ children, url }){
  return (
      <span className='text-orange-600 hover:text-orange-700 inline-flex'>
        <Link href={`${url}`} className="font-semibold text-xs">
          {children}
        </Link>
      </span>
  );
}

LinkInLine.propTypes = {
    children: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
};