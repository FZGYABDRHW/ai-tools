"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerList = void 0;
const BaseServiceV1_1 = __importDefault(require("../../../BaseServiceV1"));
class PerformerList extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.serviceUrl = `${this.baseUrl}/curator/performer/list`;
        this.getActiveIE = (params, options) => this.http
            .get(`${this.serviceUrl}/active-ie`, { params, ...options })
            .then(resp => resp.data.response);
        this.getActive = (params, options) => this.http
            .get(`${this.serviceUrl}/active`, { params, ...options })
            .then(resp => resp.data.response);
        this.getInactive = (params, options) => this.http
            .get(`${this.serviceUrl}/inactive`, { params, ...options })
            .then(resp => resp.data.response);
        this.getZombie = (params, options) => this.http
            .get(`${this.serviceUrl}/zombie`, { params, ...options })
            .then(resp => resp.data.response);
        this.getBlocked = (params, options) => this.http
            .get(`${this.serviceUrl}/blocked`, { params, ...options })
            .then(resp => resp.data.response);
        this.getDeleted = (params, options) => this.http
            .get(`${this.serviceUrl}/deleted`, { params, ...options })
            .then(resp => resp.data.response);
        this.getInvited = (params, options) => this.http
            .get(`${this.serviceUrl}/invited`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getModerationIE = (params, options) => this.http
            .get(`${this.serviceUrl}/moderation-ie`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getModeration = (params, options) => this.http
            .get(`${this.serviceUrl}/moderation`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getTabsCounts = (params, options) => this.http
            .get(`${this.serviceUrl}/tabs`, { params, ...options })
            .then(resp => resp.data.response);
        this.getModerationPerformerInfo = (id, options) => this.http
            .get(`${this.serviceUrl}/moderation/${id}`, options)
            .then(resp => resp.data.response);
        this.getElectricianPerformers = (params, options) => this.http
            .get(`${this.serviceUrl}/electrician`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
    }
}
exports.PerformerList = PerformerList;
exports.default = new PerformerList();
//# sourceMappingURL=index.js.map