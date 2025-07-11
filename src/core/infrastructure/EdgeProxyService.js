import { getRequest } from './RequestService'; 

class ProxyEdgeService {
  async getInfoRepresentedByProxy(ciamId) {
    try {   
      const response = await getRequest('edgeService','/autho/proxy/getInfoRepresentedByProxy/', true, null, ciamId);
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

export default new ProxyEdgeService();