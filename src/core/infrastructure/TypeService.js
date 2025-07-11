import { postRequestGetToken, getRequestToken } from './RequestService'; 

class TypeService {
  async getToken() {
    try {   
      const response = await postRequestGetToken('typeDocuments','/generate_token');
      if (response) {
        return response;
      } else {
        throw new Error('Error al obtener el token');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async typeDocuments(bearer) {
    try {
        const response = await getRequestToken('typeDocuments','/api/v2/tiposdedocumento', bearer);
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

export default new TypeService();