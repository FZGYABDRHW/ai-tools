"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlsService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class ControlsService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/task`;
        this.getControls = (idTask, options) => this.http
            .get(`${this.url}/${idTask}/controls`, options)
            .then(resp => resp.data.response);
    }
}
exports.ControlsService = ControlsService;
exports.default = new ControlsService();
//# sourceMappingURL=controls.js.map