"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionService = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class RegionService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/performer/settings/regions`;
    }
    async getUserLocation(params, options) {
        const { data: { response }, } = await this.http.get(`${this.url}/location`, {
            params: params,
            ...options,
        });
        return response;
    }
    async getUserRegionList(options) {
        const { data: { response }, } = await this.http.get(this.url, options);
        return response;
    }
    async getBigCity(options) {
        const { data: { response }, } = await this.http.get(`${this.url}/in-big-city`, options);
        return response;
    }
    async deleteRegionById(id, options) {
        const { data: { response }, } = await this.http.delete(this.url, { params: { regionId: id }, ...options });
        return response;
    }
    async searchRegions(params, options) {
        const { data: { response: { regions }, }, } = await this.http.get(`${this.url}/search`, {
            params: params,
            ...options,
        });
        return regions;
    }
    async addUserPolygon(params, options) {
        await this.http.post(this.url, params, options);
    }
    async searchRegistrationRegions(params, options) {
        const url = `${this.baseUrl}/performer/settings/intro-questionnaire/search-region`;
        const { data: { response: { regions }, }, } = await this.http.get(url, { params: params, ...options });
        return regions;
    }
    async getUserLocationRegistration(params, options) {
        const url = `${this.baseUrl}/performer/settings/intro-questionnaire/location`;
        const { data: { response }, } = await this.http.get(url, {
            params: params,
            ...options,
        });
        return response;
    }
}
exports.RegionService = RegionService;
exports.default = new RegionService();
//# sourceMappingURL=regions.js.map