"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndividualEntrepreneurService = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class IndividualEntrepreneurService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/performer/settings/individual-entrepreneur`;
    }
    async getIEData(options) {
        const { data: { response }, } = await this.http.get(this.url, options);
        return response;
    }
    async setIEData(params, options) {
        const { data: { response }, } = await this.http.post(this.url, params, options);
        return response;
    }
    async getBankName(bik, options) {
        const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/bank';
        const { data } = await this.http.post(url, { query: bik }, {
            headers: { Authorization: 'Token c9b0dd6416a31e2598b957d5a9bf6249e8ac21cc' },
            ...options,
        });
        if (data.suggestions && data.suggestions.length !== 0) {
            return data.suggestions[0].value;
        }
        else {
            return null;
        }
    }
}
exports.IndividualEntrepreneurService = IndividualEntrepreneurService;
exports.default = new IndividualEntrepreneurService();
//# sourceMappingURL=individual-entrepreneur.js.map