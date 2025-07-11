import TypeService from '../infrastructure/TypeService';

class TypeDocument {
  async execute(bearer) {
    try {
      return await TypeService.typeDocuments(bearer);
    } catch (error) {
      console.error('Error:', error);
      throw error;      
    }
    
  }

  async getToken() {
    try {
      return await TypeService.getToken();
    } catch (error) {
      console.error('Error:', error);
      throw error;      
    }
  }
}

export default new TypeDocument();