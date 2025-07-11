import ProxyEdgeService from '../infrastructure/EdgeProxyService';

class Proxy {
  async getInfo(ciamId) {
    return await ProxyEdgeService.getInfoRepresentedByProxy(ciamId);
  }
}

export default new Proxy();