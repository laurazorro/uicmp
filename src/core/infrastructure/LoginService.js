import { postRequest } from './RequestService'; 

class LoginService {
  async statusLogin(docType, docNumber, geodata, fingerprint) {
    try {
      const data = JSON.stringify({
        "documentType": docType,
        "documentNumber": docNumber,
        "ip": geodata.ipeCliente,
        "fingerprint": fingerprint,
        "deviceLocation": {
            "latitude": geodata.latitud || '0',
            "longitude": geodata.longitud || '0',
        },
        "serviceProvider": geodata.serviceProviderName,
        "AdditionalParameter": [
          {
            "name": "Ciudad",
            "value": geodata.ciudad || ''
          },
          {
            "name": "Pais",
            "value": geodata.pais || ''
          }
        ]
      });
      
      const response = await postRequest('login','/status', null ,data);
      if (response ) {
        return response; // Asumimos que la API devuelve un objeto con los datos del usuario
      } else {
        throw new Error('La respuesta de la API no es válida');
      }
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }
}

export default new LoginService();