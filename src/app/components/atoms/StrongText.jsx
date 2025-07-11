import PropTypes from 'prop-types';

export default function StrongText({ children }){
    return(
        <p className="font-semibold text-gray-700 text-base leading-[120%]">
           {children}
        </p>
    );
} 

StrongText.propTypes = {
  children: PropTypes.string.isRequired
};