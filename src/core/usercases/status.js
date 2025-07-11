import LoginService from '../infrastructure/LoginService';

class Status {
  async execute(docType, docNumber, geodata, fingerprint) {
    return await LoginService.statusLogin(docType, docNumber, geodata, fingerprint);
  }
}

export default new Status();