"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuratorProfile = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class CuratorProfile extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/curator/profile`;
        this.getCuratorProfile = (curatorId, options) => this.http
            .get(`${this.url}/profile?id=${curatorId}`, options)
            .then(resp => resp.data);
    }
}
exports.CuratorProfile = CuratorProfile;
exports.default = new CuratorProfile();
//# sourceMappingURL=index.js.map