import PropTypes from 'prop-types';
export default function Titulo_general({ children }){
  return (
      <div className="relative">
        <p className="text-2xl text-center lg:text-left lg:text-4xl font-bold leading-[120%] text-gray-700 lg:mb-4 -mt-8 lg:-mt-4">
          {children}
        </p>
      </div>
  );
}

Titulo_general.propTypes = {
    children: PropTypes.string.isRequired
};