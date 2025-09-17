"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsService = void 0;
const BaseServiceV2_1 = __importDefault(require("../../BaseServiceV2"));
class ContactsService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/performer/settings/contacts`;
        this.deleteAdditionalPhone = (options) => this.http
            .delete(`${this.url}/phone/additional`, options)
            .then(result => result.data.response);
        this.saveAdditionalPhone = (params, options) => this.http.post(`${this.url}/phone/additional`, params, options).then(result => result.data);
        this.deleteEmail = (options) => this.http.delete(`${this.url}/email`, options).then(result => result.data.response);
    }
    async getContacts(options) {
        const { data: { response }, } = await this.http.get(this.url, options);
        return response;
    }
}
exports.ContactsService = ContactsService;
exports.default = new ContactsService();
//# sourceMappingURL=contacts.js.map