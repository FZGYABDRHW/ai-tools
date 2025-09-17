"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationFinances = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class OrganizationFinances extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization/finances`;
        this.getFinancesBills = (params, options) => this.http
            .get(`${this.url}/bills`, { params, ...options })
            .then(resp => resp.data.response);
        this.cancelBill = (billId, options) => this.http
            .put(`${this.url}/bills/${billId}/cancel`, {}, options)
            .then(({ data: { response } }) => response);
        this.getFinancesActs = (params, options) => this.http
            .get(`${this.url}/acts`, { params, ...options })
            .then(resp => resp.data.response);
        this.getPaymentDocuments = (params, options) => this.http
            .get(`${this.url}/payment-documents`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getTotalDebtList = (params, options) => this.http
            .get(`${this.url}/total-debt`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.downloadFile = (params, options) => this.http
            .get(`${this.url}/download`, { params, responseType: 'blob', ...options })
            .then(resp => resp.data);
        this.getDownloadFileUrl = (id, token) => {
            const absoluteUrl = `${this.http.config.baseURL}${this.url}`;
            return `${absoluteUrl}/${id}/download?&access-token=${token}`;
        };
    }
}
exports.OrganizationFinances = OrganizationFinances;
exports.default = new OrganizationFinances();
//# sourceMappingURL=index.js.map