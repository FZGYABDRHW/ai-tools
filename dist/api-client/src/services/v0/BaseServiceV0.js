"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseService_1 = __importDefault(require("../BaseService"));
class BaseServiceV0 extends BaseService_1.default {
    constructor(env = {}) {
        super({ ...env });
    }
}
exports.default = BaseServiceV0;
//# sourceMappingURL=BaseServiceV0.js.map