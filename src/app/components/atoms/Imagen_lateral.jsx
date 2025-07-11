import Image from 'next/image';
import { BASE_PATH } from '../../utils/constants';
       
export default function Imagen_lateral() {
    return (
        <Image
            src={`${BASE_PATH}/login_image.svg`}
            className="object-center max-w-[75%]"
            alt="Imagen Familia"
            width={665}
            height={665}
        />
    );
  }
  