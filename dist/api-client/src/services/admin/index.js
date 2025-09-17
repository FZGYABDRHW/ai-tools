"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminServices = exports.Response = void 0;
const BaseServiceAdmin_1 = __importDefault(require("./BaseServiceAdmin"));
var Response;
(function (Response) {
    Response[Response["ERROR"] = 0] = "ERROR";
    Response[Response["SUCCESS"] = 1] = "SUCCESS";
})(Response || (exports.Response = Response = {}));
class AdminServices extends BaseServiceAdmin_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}`;
        this.savePolygons = async (params, options) => {
            const { data } = await this.http.post(`${this.url}/gis/save-polygon`, params);
            return data;
        };
    }
}
exports.AdminServices = AdminServices;
//# sourceMappingURL=index.js.map