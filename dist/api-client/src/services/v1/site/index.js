"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteService = void 0;
const BaseServiceV1_1 = __importDefault(require("../BaseServiceV1"));
const md5_1 = require("ts-md5/dist/md5");
class SiteService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.login = (phone, password, options) => this.http
            .post(`${this.baseUrl}/site/login`, {
            phone: parseInt(phone),
            password: md5_1.Md5.hashStr(password),
        }, options)
            .then(r => r.data);
        this.getImages = (options) => this.http
            .get(`${this.baseUrl}/site/bg-image`, options)
            .then(r => r.data);
    }
}
exports.SiteService = SiteService;
exports.default = new SiteService();
//# sourceMappingURL=index.js.map