"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteService = exports.SMS_TYPES = void 0;
const BaseServiceV2_1 = __importDefault(require("../BaseServiceV2"));
const md5_1 = require("ts-md5/dist/md5");
exports.SMS_TYPES = {
    REGISTRATION_CODE: 2,
    RESTORE_CODE: 3,
    CONFIRM_MAIN_PHONE: 4,
    CONFIRM_ADDITIONAL_PHONE: 5,
    BY_HUNTER_REGISTRATION_CODE: 6,
};
class SiteService extends BaseServiceV2_1.default {
    constructor() {
        super(...arguments);
        this.sendCode = (phone, type, validKey) => this.http
            .post(`${this.baseUrl}/site/send-code`, { phone, type, validKey })
            .then(r => r.data);
        this.checkCode = (type, code, phone) => this.http
            .get(`${this.baseUrl}/site/check-code`, {
            params: { type, code, phone },
        })
            .then(r => r.data);
        this.sendRegistrationCode = (params, options) => this.http
            .post(`${this.baseUrl}/site/send-code/web/registration`, params, options)
            .then(r => r.data);
        this.sendRestoreCode = (params, options) => this.http
            .post(`${this.baseUrl}/site/send-code/site/restore`, params, options)
            .then(r => r.data);
        this.checkRegistrationCode = (phone, code) => this.checkCode(exports.SMS_TYPES.REGISTRATION_CODE, code, phone);
        this.checkRestoreCode = (phone, code) => this.checkCode(exports.SMS_TYPES.RESTORE_CODE, code, phone);
        this.registration = (phone, code, password) => this.http
            .put(`${this.baseUrl}/site/registration`, { code, password: md5_1.Md5.hashStr(password), phone })
            .then(r => r.data);
        this.restorePassword = (phone, code, password) => this.http
            .put(`${this.baseUrl}/site/restore-password`, {
            phone,
            code,
            password: md5_1.Md5.hashStr(password),
        })
            .then(r => r.data);
    }
}
exports.SiteService = SiteService;
exports.default = new SiteService();
//# sourceMappingURL=index.js.map