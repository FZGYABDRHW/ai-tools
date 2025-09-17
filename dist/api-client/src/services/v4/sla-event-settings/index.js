"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SLAEventSettingsService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class SLAEventSettingsService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/group-event-settings`;
        this.getEventSettings = (group, options) => this.http
            .get(`${this.url}/${group}`, options)
            .then(response => response.data.response);
    }
}
exports.SLAEventSettingsService = SLAEventSettingsService;
//# sourceMappingURL=index.js.map