import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BASE_PATH, urlCorporativo } from '../../utils/constants';


export default function Logo() {
    const [url, setUrl] = useState('/');
    
    useEffect(() => {
        const parameters = sessionStorage.getItem('parameters');
        if (parameters) {
            setUrl(`/?${parameters}`);
        }
        else{
            setUrl(urlCorporativo);
        }
    }, []);

    return (
        <Link href={url}>
            <Image
            className="absolute mt-5 lg:w-48 w-32"
            src={`${BASE_PATH}/logo_image.svg`}
            alt="Logo Compensar Caja de Compensación Familiar y EPS"
            width={250}
            height={67}
            title='Volver a la página principal'
            />               
        </Link>

      

    );
}