"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactPhoneService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class ContactPhoneService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/contact-phone`;
        this.getContactPhones = (entity, entityId, options) => this.http
            .get(`${this.url}/${entity}/${entityId}`, options)
            .then(resp => resp.data.response);
        this.createContactPhones = (shopId, phone, options) => this.http
            .post(`${this.url}/shop/${shopId}`, phone, options)
            .then(resp => resp.data.response);
        this.createContactPhonesByEntity = (entity, entityId, phone, options) => this.http
            .post(`${this.url}/${entity}/${entityId}`, phone, options)
            .then(resp => resp.data.response);
        this.updateContactPhones = (phone, options) => this.http
            .patch(`${this.url}/${phone.id}`, phone, options)
            .then(resp => resp.data.response);
        this.deleteContactPhones = (id, options) => this.http.delete(`${this.url}/${id}`, options).then(resp => resp.data.response);
    }
}
exports.ContactPhoneService = ContactPhoneService;
//# sourceMappingURL=index.js.map