import ThemesEdgeService from '../infrastructure/EdgeService';

class Themes {
  async getThemes(serviceProvider) {
    return await ThemesEdgeService.edgeServiceThemes(serviceProvider);
  }
  async getCommerce(businessShortName) {
    return await ThemesEdgeService.edgeServiceCommerce(businessShortName);
  }
}

export default new Themes();