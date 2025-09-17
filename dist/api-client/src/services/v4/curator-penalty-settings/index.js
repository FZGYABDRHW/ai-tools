"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuratorPenaltySettingsService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class CuratorPenaltySettingsService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator-penalty-settings`;
        this.getListOfSettings = (options) => this.http
            .get(this.url, { ...options })
            .then(response => response.data.response);
    }
}
exports.CuratorPenaltySettingsService = CuratorPenaltySettingsService;
//# sourceMappingURL=index.js.map