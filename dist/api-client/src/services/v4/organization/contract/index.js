"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractService = void 0;
const BaseServiceV4_1 = __importDefault(require("../../BaseServiceV4"));
class ContractService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization`;
        this.get = (id, options) => this.http
            .get(`${this.url}/contract/${id}`)
            .then(resp => resp.data.response);
        this.getVat = (id, options) => this.http
            .get(`${this.url}/contract/${id}/vat`)
            .then(resp => resp.data.response);
        this.getList = (organizationId, params = {}, options) => this.http
            .get(`${this.url}/${organizationId}/contract`, {
            params: {
                ids: params.ids !== void 0 ? params.ids.join(',') : null,
                suborganizationId: params.suborganizationId,
                departmentId: params.departmentId,
                limit: params.limit,
            },
        })
            .then(resp => resp.data.response);
        this.getBranch = (organizationId, ids, options) => this.http
            .get(`${this.url}/${organizationId}/branch`, {
            params: {
                ids: ids.join(','),
            },
        })
            .then(resp => resp.data.response);
        this.getPriceTree = (contractId, params = {}, options) => this.http
            .get(`${this.url}/contract/${contractId}/price`, {
            params: {
                shopId: params.shopId,
                lat: params.lat,
                lng: params.lng,
                polygonId: params.polygonId,
            },
        })
            .then(resp => resp.data.response);
        this.getFranchise = (contractId, options) => this.http
            .get(`${this.url}/contract/${contractId}/franchise`, options)
            .then(resp => resp.data.response);
    }
}
exports.ContractService = ContractService;
exports.default = new ContractService();
//# sourceMappingURL=index.js.map