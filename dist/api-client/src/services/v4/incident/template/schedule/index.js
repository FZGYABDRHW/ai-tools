"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateScheduleService = void 0;
const BaseServiceV4_1 = __importDefault(require("../../../BaseServiceV4"));
class TemplateScheduleService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/incident/template/schedule`;
        this.deleteSchedule = (id) => this.http.delete(`${this.url}/${id}`).then(resp => resp.data.response);
    }
}
exports.TemplateScheduleService = TemplateScheduleService;
//# sourceMappingURL=index.js.map