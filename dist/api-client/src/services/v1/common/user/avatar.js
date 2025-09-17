"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarService = void 0;
const BaseServiceV1_1 = __importDefault(require("../../BaseServiceV1"));
class AvatarService extends BaseServiceV1_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/common/user/get-avatar-upload-config`;
    }
    async getUserAvatar() {
        const { data: { response }, } = await this.http.get(this.url);
        return response;
    }
}
exports.AvatarService = AvatarService;
exports.default = new AvatarService();
//# sourceMappingURL=avatar.js.map