"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
class OrganizationService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/organization`;
        this.get = (id, options) => this.http
            .get(`${this.url}/${id}`, options)
            .then(resp => resp.data.response);
        this.getBranches = (organizationId, params, options) => this.http
            .get(`${this.url}/${organizationId}/branch`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getSuppliers = (params, options) => this.http
            .get(`${this.url}/suppliers`, { params, ...options })
            .then(resp => resp.data.response);
        this.getList = (ids, limit, options) => this.http
            .get(`${this.url}`, {
            params: {
                ids: ids.join(','),
                limit: limit,
            },
            ...options,
        })
            .then(resp => resp.data.response);
        this.findDuplicates = (subOrganizationId, params, options) => this.http
            .get(`${this.url}/suborganization/${subOrganizationId}/shop/find-duplicates`, { params, ...options })
            .then(resp => resp.data.response);
        this.getDepartmentsList = (id, params, options) => this.http
            .get(`${this.url}/${id}/department`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getDepartments = (id, options) => this.http
            .get(`${this.url}/department/${id}`, options)
            .then(resp => resp.data.response);
        this.getSuborganization = (id, options) => this.http
            .get(`${this.url}/suborganization/${id}`, options)
            .then(resp => resp.data.response);
        this.getExpendablePriceList = (organizationId, departmentId, params, options) => this.http
            .get(`${this.url}/${organizationId}/department/${departmentId}/expendable-price-list`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getExpendablePriceListByContract = (organizationId, contractId, params, options) => this.http
            .get(`${this.url}/${organizationId}/contract/${contractId}/expendable-price-list`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getContractList = (id, params, options) => this.http
            .get(`${this.url}/${id}/contract`, { params, ...options })
            .then(resp => resp.data.response);
        this.getDepartmentsListUnderContract = (organizationId, contractId, options) => this.http
            .get(`${this.url}/${organizationId}/contract/${contractId}/departments`, options)
            .then(resp => resp.data.response);
        this.getBranch = (branchId, options) => this.http
            .get(`${this.url}/branch/${branchId}`, options)
            .then(resp => resp.data.response);
        this.getBranchByCoordinates = (organizationId, params, options) => this.http
            .get(`${this.url}/${organizationId}/branch/branch-by-coordinates`, { params, ...options })
            .then(resp => resp.data.response);
        this.getOrganizationPriceList = (organizationId, params, options) => this.http
            .get(`${this.url}/${organizationId}/contract/price-list`, { params, ...options })
            .then(resp => resp.data.response);
        this.getCategoryPriceList = (organizationId, priceId, params, options) => this.http
            .get(`${this.url}/${organizationId}/contract/price-list/${priceId}`, { params, ...options })
            .then(resp => resp.data.response);
        this.sendTasksData = (organizationId, data, options) => this.http
            .post(`${this.url}/${organizationId}/report/tasks`, data, options)
            .then(response => response.data.response);
        this.getSalesManager = (organizationId, params, options) => this.http
            .get(`${this.url}/${organizationId}/sales-manager`, {
            params,
            ...options,
        })
            .then(response => response.data.response);
        this.getEmails = (organizationId, options) => this.http
            .get(`${this.url}/${organizationId}/emails`, options)
            .then(response => response.data.response);
        this.updateEmails = (organizationId, emails, options) => this.http
            .put(`${this.url}/${organizationId}/emails`, emails, options)
            .then(response => response.data.response);
        this.getSupplierPaymentList = (params, options) => this.http
            .get(`${this.url}/supplier/payments`, {
            params,
            ...options,
        })
            .then(response => response.data.response);
        this.getPaymentTaskLink = (params, options) => this.http
            .get(`${this.url}/supplier/payment/linked-task`, {
            params,
            ...options,
        })
            .then(response => response.data.response);
        this.createSupplierPayment = (params, options) => this.http
            .post(`${this.url}/supplier/payment`, params, options)
            .then(response => response.data.response);
        this.changePaymentStatus = (id, status, options) => this.http
            .patch(`${this.url}/supplier/payment/${id}/${status}`, options)
            .then(response => response.data.response);
    }
}
exports.OrganizationService = OrganizationService;
exports.default = new OrganizationService();
//# sourceMappingURL=index.js.map