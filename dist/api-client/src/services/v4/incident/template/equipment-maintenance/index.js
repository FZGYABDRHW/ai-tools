"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentMaintenanceService = void 0;
const BaseServiceV4_1 = __importDefault(require("../../../BaseServiceV4"));
class EquipmentMaintenanceService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/incident/template/equipment-maintenance`;
        this.getScheduleList = (params, options) => this.http
            .get(`${this.url}/schedule`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getSchedule = (scheduleId, options) => this.http
            .get(`${this.url}/schedule/${scheduleId}`, {
            ...options,
        })
            .then(resp => resp.data.response);
        this.getScheduleTemplate = (templateId, options) => this.http
            .get(`${this.url}/${templateId}`, {
            ...options,
        })
            .then(resp => resp.data.response);
        this.createScheduleTemplate = (params, options) => this.http
            .post(this.url, params, {
            ...options,
        })
            .then(resp => resp.data.response);
        this.createSchedule = (params, options) => this.http
            .post(`${this.url}/schedule`, params, {
            ...options,
        })
            .then(resp => resp.data.response);
    }
}
exports.EquipmentMaintenanceService = EquipmentMaintenanceService;
//# sourceMappingURL=index.js.map