"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierService = void 0;
const BaseServiceV4_1 = __importDefault(require("../../BaseServiceV4"));
class SupplierService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization/supplier`;
        this.getCountryList = () => this.http.get(`${this.url}/countries`).then(resp => {
            return resp.data.response.items;
        });
    }
}
exports.SupplierService = SupplierService;
exports.default = new SupplierService();
//# sourceMappingURL=index.js.map