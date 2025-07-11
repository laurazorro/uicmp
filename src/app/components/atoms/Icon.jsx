import PropTypes from 'prop-types';
import Image from 'next/image';

import { BASE_PATH } from '../../utils/constants';

export default function Icon({ route, title }) {
    return(
        <Image
            className="inline-flex"
            src={BASE_PATH+route}
            alt={title}
            width={25}
            height={25}
            priority
        />
    );
} 

Icon.propTypes = {
  title: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired
};