import PropTypes from 'prop-types';
export default function Subtitulo_general({ children }){
    return(
        <p className="text-gray-600 text-center lg:text-left text-sm leading-[120%] min-[1281px]:mb-6 mb-3">
            {children}
        </p>
    );
}

Subtitulo_general.propTypes = {
    children: PropTypes.string.isRequired
};