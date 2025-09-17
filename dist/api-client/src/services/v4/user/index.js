"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class UserService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/user`;
        this.login = (phone, password) => this.http
            .post(`${this.url}/login`, {
            phone,
            password,
        })
            .then(r => r.data);
        this.checkToken = (token) => this.http
            .post(`${this.url}/login/token`, { token })
            .then(r => r.data)
            .catch(r => r.response.data);
        this.loginByEmail = ({ email, portal }) => this.http
            .post(`${this.url}/login/send-link`, {
            email,
            portal,
        })
            .then(r => r.data)
            .catch(r => r.response.data);
        this.get = (id, options) => this.http.get(`${this.url}/${id}`, options).then(resp => resp.data);
        this.getOrganizationUsersByRole = (role, organizationId, options) => this.http
            .get(`${this.url}?roleName=${role}&organizationId=${organizationId}`, options)
            .then(resp => resp.data.response);
        this.getList = (ids, options) => this.http
            .get(`${this.url}`, {
            params: { ids: ids.join(',') },
            ...options,
        })
            .then(resp => resp.data);
        this.getListUser = (params) => this.http
            .get(`${this.url}`, { params })
            .then(resp => resp.data.response);
        this.getUserOrganization = (id, options) => this.http
            .get(`${this.url}/${id}/organization`, options)
            .then(resp => resp.data.response);
        this.getResponsibleUsers = (organizationId, params, options) => this.http
            .get(`${this.url}/organization/${organizationId}/responsible-users`, { params, ...options })
            .then(resp => resp.data.response);
        this.getPerformer = (performerId, options) => this.http
            .get(`${this.url}/${performerId}/performer`, options)
            .then(resp => resp.data);
        this.getAnnotations = (userId, params, options) => this.http
            .get(`${this.url}/${userId}/annotation`, options)
            .then(resp => resp.data);
        this.rejectPayment = (userId, walletLogId, options) => this.http
            .post(`${this.url}/${userId}/performer/wallet/payment/${walletLogId}/reject`, {}, options)
            .then(resp => resp.data.response);
        this.startBindSelfEmployed = (userId, options) => this.http
            .post(`${this.url}/${userId}/performer/self-employed/start-bind`, {}, options)
            .then(resp => resp.data.response);
        this.revokeSelfEmloyed = async (userId, options) => this.http
            .patch(`${this.url}/${userId}/performer/self-employed/revoke`)
            .then(resp => resp.data.response);
        this.statusBindSelfEmployed = (userId, params, options) => this.http
            .get(`${this.url}/${userId}/performer/self-employed/bind-step`, { params, ...options })
            .then(resp => resp.data.response);
        this.getDepartmentsList = (userId, options) => this.http
            .get(`${this.url}/${userId}/organization/department`, options)
            .then(resp => resp.data.response);
        this.getLastCalledPhoneNumber = (userId, options) => this.http
            .get(`${this.url}/${userId}/hunter/last-call`, options)
            .then(resp => resp.data.response);
        this.revokeIEStatus = async (contractorId, options) => this.http
            .patch(`${this.url}/${contractorId}/performer/individual-entrepreneur/revoke`)
            .then(resp => resp.data.response);
        this.contractorSelfEmployedProfile = (contractorId, options) => this.http
            .get(`${this.url}/${contractorId}/performer/self-employed`, options)
            .then(resp => resp.data.response);
        this.createJWT = (dataToEncrypt, options) => this.http
            .post(`${this.url}/jwt`, {
            claims: {
                payload: dataToEncrypt,
            },
        }, options)
            .then(resp => resp.data.response);
    }
}
exports.UserService = UserService;
exports.default = new UserService();
//# sourceMappingURL=index.js.map