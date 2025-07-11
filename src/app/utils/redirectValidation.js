import { urlTienda, urlCorporativo } from './constants';

export function redirect(){
  let sp = sessionStorage.getItem("serviceProviderName");
  switch (sp) {
    case 'ORC-TST-SP':
        location.href = urlTienda;
        break;
    case 'WSFED-SP':
        location.href = urlCorporativo;
        break;
    default:
        break;
  }
}