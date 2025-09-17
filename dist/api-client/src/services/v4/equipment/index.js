"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class EquipmentService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/equipment`;
        this.remove = (id) => this.http.delete(`${this.url}/${id}`).then(resp => resp.data.response);
        this.getEquipmentList = (params, options) => this.http
            .get(`${this.url}`, { params, ...options })
            .then(resp => resp.data.response);
        this.getEquipment = (id, params, options) => this.http
            .get(`${this.url}/${id}`, { params, ...options })
            .then(resp => resp.data.response);
        this.getEquipmentFiles = (id, options) => this.http
            .get(`${this.url}/${id}/files`, options)
            .then(resp => resp.data.response);
        this.createEquipment = (data, options) => this.http
            .post(`${this.url}`, data, options)
            .then(resp => resp.data.response);
        this.edit = (id, data, options) => this.http
            .put(`${this.url}/${id}`, data, options)
            .then(resp => resp.data.response);
        this.getManufacturers = () => this.http
            .get(`${this.url}/manufacturer`)
            .then(resp => resp.data.response);
        this.createManufacturer = (data) => this.http
            .post(`${this.url}/manufacturer`, data)
            .then(resp => resp.data.response);
        this.getCategories = () => this.http
            .get(`${this.url}/category`)
            .then(resp => resp.data.response);
        this.getManufacturer = (id, options) => this.http
            .get(`${this.url}/manufacturer/${id}`, options)
            .then(resp => resp.data.response);
        this.getTypes = () => this.http
            .get(`${this.url}/type`)
            .then(resp => resp.data.response);
        this.createType = (data) => this.http
            .post(`${this.url}/type`, data)
            .then(resp => resp.data.response);
        this.getType = (id, options) => this.http
            .get(`${this.url}/type/${id}`, options)
            .then(resp => resp.data.response);
        this.getMaintenanceHistory = (id, params, options) => this.http
            .get(`${this.url}/${id}/incidents`, { params, ...options })
            .then(resp => resp.data.response);
    }
}
exports.EquipmentService = EquipmentService;
exports.default = new EquipmentService();
//# sourceMappingURL=index.js.map