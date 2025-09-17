"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axiosInstanceProxy_1 = require("../axiosInstanceProxy");
class BaseService {
    constructor({ version, config, instance }) {
        if (instance) {
            this.http = instance;
        }
        else if (config) {
            this.http = (0, axiosInstanceProxy_1.createInstance)(config);
        }
        else {
            this.http = axiosInstanceProxy_1.axiosInstance;
        }
        this.APIVersion = version;
        if (version) {
            this.baseUrl = `/${this.APIVersion}`;
        }
        else {
            this.baseUrl = ``;
        }
    }
}
exports.default = BaseService;
//# sourceMappingURL=BaseService.js.map