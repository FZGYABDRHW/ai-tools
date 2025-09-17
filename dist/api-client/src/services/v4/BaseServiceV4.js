"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseService_1 = __importDefault(require("../BaseService"));
const API_VERSION = 'v4';
class BaseServiceV4 extends BaseService_1.default {
    constructor(env = {}) {
        super({ ...env, version: API_VERSION });
    }
}
exports.default = BaseServiceV4;
//# sourceMappingURL=BaseServiceV4.js.map