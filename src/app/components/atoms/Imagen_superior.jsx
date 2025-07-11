import Image from 'next/image'
import { BASE_PATH } from '../../utils/constants';
    
export default function Imagen_superior() {
    return (
        <Image
            className="h-16 object-center"
            src={`${BASE_PATH}/mobile_image.svg`}
            alt="Imagen Familia"
            width={318}
            height={51}
        />
    );
  }
  