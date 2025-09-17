"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
const interfaces_1 = require("./interfaces");
class TaskService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/task`;
        this.get = (id, options) => this.http
            .get(`${this.url}/${id}`, options)
            .then(resp => resp.data.response);
        this.getList = (params, options) => this.http
            .get(`${this.url}`, { params, ...options })
            .then(response => response.data.response);
        this.updateTask = (taskId, params, options) => this.http
            .patch(`${this.url}/${taskId}`, params, options)
            .then(resp => resp.data.response);
        this.unassignPerformer = (id, params, options) => this.http
            .post(`${this.url}/${id}/unassign-performer`, params, options)
            .then(resp => resp.data.response);
        this.addAdditionalRequirements = (taskId, requirementKey, options) => this.http
            .post(`${this.url}/${taskId}/requirement`, { key: requirementKey }, options)
            .then(resp => resp.data.response);
        this.deleteAdditionalRequirements = (taskId, requirementId, options) => this.http
            .delete(`${this.url}/${taskId}/requirement/${requirementId}`, options)
            .then(resp => resp.data.response);
        this.getAdditionalRequirements = (taskId, options) => this.http
            .get(`${this.url}/${taskId}/requirement`, options)
            .then(resp => resp.data.response);
        this.getActiveSuitablePerformers = (taskId, options) => this.http
            .get(`${this.url}/${taskId}/performer/suitable/active`, options)
            .then(resp => resp.data);
        this.toggleCashlessPayment = (taskId, options) => this.http
            .post(`${this.url}/${taskId}/cashless`, {}, options)
            .then(resp => resp.data.response);
        this.sendNotification = (taskId, options) => this.http
            .post(`${this.url}/${taskId}/send-notification`, {}, options)
            .then(resp => resp.data.response);
        this.getWorksList = (taskId, options) => this.http
            .get(`${this.url}/${taskId}/work`, options)
            .then(resp => resp.data.response);
        this.getWorkPrice = (taskId, options) => this.http
            .get(`${this.url}/${taskId}/work/price`, options)
            .then(resp => resp.data.response);
        this.getRejectedWorkList = (taskId, options) => this.http
            .get(`${this.url}/${taskId}/work/rejected`, options)
            .then(resp => resp.data.response);
        this.getPerformerArrivals = (taskId, options) => this.http
            .get(`${this.url}/${taskId}/arrivals`, options)
            .then(resp => resp.data.response);
        this.getContractorPlannedArrival = async (taskId, options) => this.getPerformerArrivals(taskId, {
            ...options,
            params: {
                limit: 1,
                offset: 0,
                statuses: [interfaces_1.ContractorArrivalDateStatuses.PLANNED],
            },
        }).then(response => (response.items.length ? response.items[0] : null));
        this.addNewArrival = (taskId, params, options) => this.http
            .post(`${this.url}/${taskId}/arrivals`, params, options)
            .then(response => response.data.response);
        this.updateArrivalDate = async (taskId, params, options) => this.http
            .put(`${this.url}/${taskId}/arrivals`, params, options)
            .then(response => response.data.response);
        this.getTaskPerformerAttachments = (taskId, params, options) => this.http
            .get(`${this.url}/${taskId}/attachment/performer`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getEvents = (taskId, params, options) => this.http
            .get(`${this.url}/${taskId}/event`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getEventAttachments = (eventId, options) => this.http
            .get(`${this.url}/comment/${eventId}/files`, options)
            .then(resp => resp.data.response);
        this.postComment = (taskId, params, options) => this.http
            .post(`${this.url}/${taskId}/event`, params, options)
            .then(resp => resp.data.response);
        this.performerReject = (taskId, params) => this.http
            .post(`${this.url}/${taskId}/performer-reject`, params)
            .then(resp => resp.data.response);
        this.deleteComment = (taskId, eventId, options) => this.http
            .delete(`${this.url}/${taskId}/event/${eventId}`, options)
            .then(resp => resp.data.response);
        this.changeTaskContract = (taskId, data, options) => this.http
            .put(`${this.url}/${taskId}/change-contract`, data, options)
            .then(resp => resp.data.response);
        this.getTaskRating = (taskId, options) => this.http
            .get(`${this.url}/${taskId}/rating`, options)
            .then(resp => resp.data.response);
        this.calculatePlanCloseDate = (data, options) => this.http
            .post(`${this.url}/calculate-plan-close-date`, data, options)
            .then(resp => resp.data.response);
        this.getPlanCloseDate = (taskId, options) => this.http
            .get(`${this.url}/${taskId}/plan-close-date`, options)
            .then(resp => resp.data.response);
        this.getCloneAttachmentFiles = (taskId, options) => this.http
            .post(`${this.url}/${taskId}/attachment/clone`, options)
            .then(resp => resp.data.response);
        this.setDateOfAct = (taskId, date) => {
            return this.http
                .patch(`${this.url}/${taskId}/act-of-completed-work-date`, {
                date: date,
            })
                .then(resp => resp.data);
        };
        this.liftPriority = async (taskId, options) => {
            await this.http
                .put(`${this.url}/${taskId}/change-priority`, { taskId: taskId }, options)
                .then(resp => resp.data.response);
        };
        this.getTaskImportance = async (taskId, options) => await this.http
            .get(`${this.url}/${taskId}/important`, options)
            .then(resp => resp.data.response);
        this.setTaskImportance = async (taskId, options) => await this.http
            .post(`${this.url}/${taskId}/important`, {}, options)
            .then(resp => resp.data.response);
        this.removeTaskImportance = async (taskId, options) => await this.http
            .delete(`${this.url}/${taskId}/important`, options)
            .then(resp => resp.data.response);
        this.getPerformerInvoice = async (taskId, options) => await this.http
            .get(`${this.url}/${taskId}/invoice`, options)
            .then(resp => resp.data.response);
        this.createPerformerInvoice = async (taskId, params, options) => await this.http
            .post(`${this.url}/${taskId}/invoice`, params, options)
            .then(resp => resp.data.response);
        this.approvePerformerInvoice = async (taskId, params) => await this.http
            .patch(`${this.url}/invoice/${taskId}/approve`, params)
            .then(resp => resp.data.response);
        this.editPerformerInvoice = async (id, params, options) => await this.http
            .put(`${this.url}/invoice/${id}`, params, options)
            .then(resp => resp.data.response);
        this.getPerformerInvoiceFiles = async (taskId, options) => await this.http
            .get(`${this.url}/${taskId}/invoice/files`, options)
            .then(resp => resp.data.response);
        this.setVatStrategy = (taskId, params) => this.http
            .patch(`${this.url}/${taskId}/set-vat-strategy`, params)
            .then(resp => resp.data.response);
        this.getExtraFields = (taskId) => this.http
            .get(`${this.url}/${taskId}/extra-fields`)
            .then(resp => resp.data.response);
        this.notifyPerformersAboutNewTask = async (taskId) => await this.http
            .post(`${this.url}/${taskId}/notify-performers-about-new-task`, {})
            .then(resp => resp.data.response);
        this.enableArriveOnTime = (taskId) => this.http
            .patch(`${this.url}/${taskId}/arrive-on-time/enable`)
            .then(resp => resp.data.response);
        this.disableArriveOnTime = (taskId) => this.http
            .patch(`${this.url}/${taskId}/arrive-on-time/disable`)
            .then(resp => resp.data.response);
        this.getCancelReasons = (taskId) => this.http
            .get(`${this.url}/${taskId}/cancel-reasons`)
            .then(resp => resp.data.response);
        this.getCancelReason = (taskId) => this.http
            .get(`${this.url}/${taskId}/cancel-reason`)
            .then(resp => resp.data.response);
        this.refusePerformer = (taskId) => this.http
            .post(`${this.url}/${taskId}/refuse-performer`, {})
            .then(resp => resp.data.response);
    }
    post(data, options) {
        return this.http.post(this.url, data, options).then(resp => resp.data.response);
    }
    getExecutionAddress(taskId, options) {
        return this.http
            .get(`${this.url}/${taskId}/execution-address`, {
            ...options,
        })
            .then(resp => resp.data.response);
    }
}
exports.TaskService = TaskService;
exports.default = new TaskService();
//# sourceMappingURL=index.js.map