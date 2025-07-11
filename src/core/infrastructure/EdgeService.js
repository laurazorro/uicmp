import { getRequest } from './RequestService'; 

class ThemesEdgeService {
  async edgeServiceThemes(serviceProvider) {
    try {   
      const response = await getRequest('edgeService','/service-provider/themes/', true, null, serviceProvider);
      if (response ) {
        return response;
      } else {
        throw new Error('La respuesta de la API no es válida');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async edgeServiceCommerce(businessShortName) {
    try {
        const params = { 'countryCode': 'CO', 'businessShortName': businessShortName, 'channelShortName': 'web' } 
        const response = await getRequest('edgeService','/commerce/publicKey', false, null, params);
        if (response ) {
            return response;
        } else {
            throw new Error('La respuesta de la API no es válida');
        }
    } catch (error) {
        console.error('Error:', error);
      throw error;
    }
  }
}

export default new ThemesEdgeService();