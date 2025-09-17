"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CleaningProjectService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
const adapter_1 = require("./adapter");
class CleaningProjectService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.url = `${this.baseUrl}/cleaning/project`;
        this.getProjects = (params, options) => this.http
            .get(`${this.url}`, { params, ...options })
            .then(resp => resp.data.response);
        this.getProject = (id, params, options) => this.http
            .get(`${this.url}/${id}`, { params, ...options })
            .then(resp => resp.data.response);
        this.getTaskForProject = (idProject, params, options) => this.http
            .get(`${this.url}/${idProject}/task`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getTask = (taskId, options) => this.http
            .get(`${this.url}/task/${taskId}`, options)
            .then(resp => resp.data.response);
        this.getProjectPayout = (projectId, params, options) => this.http
            .get(`${this.url}/${projectId}/payout`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.createProjectPayout = (projectId, params, options) => this.http
            .post(`${this.url}/${projectId}/payout`, params, options)
            .then(resp => resp.data.response);
        this.getListPerformerWithServices = (projectId, taskId, options) => this.http
            .get(`${this.url}/${projectId}/task/${taskId}/performer`, options)
            .then(resp => resp.data.response);
        this.editProject = (project, options) => this.http
            .put(`${this.url}/${project.id}`, project, options)
            .then(resp => resp.data.response);
        this.createProject = (project, options) => this.http
            .post(`${this.url}`, project, options)
            .then(resp => resp.data.response);
        this.getCategoryForProject = (projectId, options) => this.http
            .get(`${this.url}/${projectId}/category`, options)
            .then(resp => resp.data.response);
        this.getTaskCalendarPlanForDay = (relatedEntityId, options) => this.http
            .get(`${this.url}/task/calendar/${relatedEntityId}`, options)
            .then(resp => resp.data.response);
        this.getListTaskEvents = (projectId, taskId, eventOptions, options) => this.http
            .get(`${this.url}/${projectId}/task/${taskId}/event`, {
            ...options,
            params: eventOptions,
        })
            .then(resp => resp.data.response);
        this.createTaskEvent = (projectId, taskId, params, options) => this.http
            .post(`${this.url}/${projectId}/task/${taskId}/event`, params, options)
            .then(resp => resp.data.response);
        this.updateTaskEvent = (projectId, taskId, eventId, params, options) => this.http
            .put(`${this.url}/${projectId}/task/${taskId}/event/${eventId}`, params, options)
            .then(resp => resp.data.response);
        this.deleteTaskEvent = (projectId, taskId, eventId, options) => this.http
            .delete(`${this.url}/${projectId}/task/${taskId}/event/${eventId}`, options)
            .then(resp => resp.data.response);
        this.addCategory = (projectId, category, options) => this.http
            .post(`${this.url}/${projectId}/category`, category, options)
            .then(resp => resp.data.response);
        this.editCategory = (v, options) => this.http
            .put(`${this.url}/${v.projectId}/category/${v.id}`, v, options)
            .then(resp => resp.data.response);
        this.deleteCategory = (projectId, categoryId, options) => this.http
            .delete(`${this.url}/${projectId}/category/${categoryId}`, options)
            .then(resp => resp.data.response);
        this.getProjectCategoryShops = (projectId, categoryId, params, options) => this.http
            .get(`${this.url}/${projectId}/category/${categoryId}/shop`, { params, ...options })
            .then(resp => resp.data.response);
        this.getTaskInventory = (projectId, taskId, options) => this.http
            .get(`${this.url}/${projectId}/task/${taskId}/inventory`, options)
            .then(resp => resp.data.response);
        this.createTaskInventory = (projectId, taskId, inventory, options) => this.http
            .post(`${this.url}/${projectId}/task/${taskId}/inventory`, inventory, options)
            .then(resp => resp.data.response);
        this.updateTaskInventory = (projectId, taskId, inventory, options) => this.http
            .put(`${this.url}/${projectId}/task/${taskId}/inventory/${inventory.id}`, inventory, options)
            .then(resp => resp.data.response);
        this.deleteTaskInventory = (projectId, taskId, inventoryId, options) => this.http
            .delete(`${this.url}/${projectId}/task/${taskId}/inventory/${inventoryId}`, options)
            .then(resp => resp.data.response);
        this.getTaskExpendableReceipt = (projectId, taskId, options) => this.http
            .get(`${this.url}/${projectId}/task/${taskId}/expendable-receipt`, options)
            .then(resp => resp.data.response);
        this.deleteTaskExpendableReceipt = (projectId, taskId, receiptId, options) => this.http
            .delete(`${this.url}/${projectId}/task/${taskId}/expendable-receipt/${receiptId}`, options)
            .then(resp => resp.data.response);
        this.createTaskExpendableReceipt = (projectId, taskId, data, options) => this.http
            .post(`${this.url}/${projectId}/task/${taskId}/expendable-receipt`, data, options)
            .then(resp => resp.data.response);
        this.getTaskPerformers = (projectId, taskId, options) => this.http
            .get(`${this.url}/${projectId}/task/${taskId}/performer`, options)
            .then(resp => resp.data.response);
        this.updateTaskCalendarPlan = (projectId, taskId, calendarId, incomplete, options) => this.http
            .put(`${this.url}/${projectId}/task/${taskId}/calendar/${calendarId}`, { incomplete }, options)
            .then(resp => resp.data.response);
        this.getListSuitablePerformers = (projectId, taskId, params, options) => this.http
            .get(`${this.url}/${projectId}/task/${taskId}/performer/suitable`, { params, ...options })
            .then(resp => resp.data.response);
        this.assignPerformerOnService = (projectId, taskId, performerId, params, options) => this.http
            .post(`${this.url}/${projectId}/task/${taskId}/performer/${performerId}/assign`, params, options)
            .then(resp => resp.data.response);
        this.dismissPerformerOnService = (projectId, taskId, performerId, params, options) => this.http
            .delete(`${this.url}/${projectId}/task/${taskId}/performer/${performerId}/dismiss`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.assignHunterOnTask = (projectId, taskId, hunterId, options) => this.http
            .post(`${this.url}/${projectId}/task/${taskId}/hunter/${hunterId}/assign`, {}, options)
            .then(resp => resp.data.response);
        this.getTaskAttachments = (projectId, taskId, options) => this.http
            .get(`${this.url}/${projectId}/task/${taskId}/attachment`, options)
            .then(resp => resp.data.response);
        this.getTaskCategoryList = (projectId, taskId, params) => this.http
            .get(`${this.url}/${projectId}/task/${taskId}/category`, { params })
            .then(resp => resp.data.response);
        this.getProjectCategories = (id, params, options) => this.http
            .get(`${this.url}/${id}/category`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getCategory = (projectId, categoryId, options) => this.http
            .get(`${this.url}/${projectId}/category/${categoryId}`, options)
            .then(resp => resp.data.response);
        this.getTaskCategory = (projectId, taskId, projectCategoryId, performerId, options) => this.http
            .get(`${this.url}/${projectId}/task/${taskId}/category`, {
            params: {
                performerId,
                projectCategoryId,
            },
            ...options,
        })
            .then(resp => resp.data.response);
        this.getCategoriesListWithPerformers = (projectId, taskId, options) => this.http
            .get(`${this.url}/${projectId}/task/${taskId}/performer`, options)
            .then(resp => resp.data.response);
        this.getTaskPayout = (projectId, taskId, params, options) => this.http
            .get(`${this.url}/${projectId}/task/${taskId}/payout`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.taskPayout = (projectId, taskId, params, options) => this.http
            .post(`${this.url}/${projectId}/task/${taskId}/payout`, params, options)
            .then(resp => resp.data.response);
        this.taskInventoryPayout = (projectId, taskId, inventoryId, options) => this.http
            .post(`${this.url}/${projectId}/task/${taskId}/inventory/${inventoryId}/payout`, {}, options)
            .then(resp => resp.data.response);
        this.getTaskCalendarPlan = (projectId, taskId, params, options) => this.http
            .get(`${this.url}/${projectId}/task/${taskId}/calendar`, {
            params,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getProjectCategoryView = (projectId, categoryId, options) => this.http
            .get(`${this.url}/${projectId}/category/${categoryId}`, options)
            .then(resp => resp.data.response);
        this.updateCleaningTask = (projectId, taskId, status, options) => this.http
            .patch(`${this.url}/${projectId}/task/${taskId}`, {
            status,
            ...options,
        })
            .then(resp => resp.data.response);
        this.getTaskCompensationList = (projectId, taskId, params, options) => this.http
            .get(`${this.url}/${projectId}/task/${taskId}/compensation`, { params, ...options })
            .then(response => response.data.response);
        this.assignPerformerCompensation = (projectId, taskId, compensationId, performerId) => this.http
            .patch(`${this.url}/${projectId}/task/${taskId}/compensation/${compensationId}/performer/${performerId}/assign`)
            .then(response => response.data.response);
        this.dismissPerformerCompensation = (projectId, taskId, compensationId) => this.http
            .patch(`${this.url}/${projectId}/task/${taskId}/compensation/${compensationId}/performer/dismiss`)
            .then(response => response.data.response);
        this.payoutPerformerCompensation = (projectId, taskId, compensationId) => this.http
            .patch(`${this.url}/${projectId}/task/${taskId}/compensation/${compensationId}/payout`)
            .then(response => response.data.response);
        this.setNotificationConfig = (projectId, shopId, params, options) => this.http
            .post(`${this.url}/${projectId}/category/shop/${shopId}/notification-config`, params, options)
            .then(response => response.data.response);
        this.getNotificationConfigs = (projectId, shopId) => this.http
            .get(`${this.url}/${projectId}/category/shop/${shopId}/notification-config`)
            .then(resp => (0, adapter_1.notificationConfigAdapter)(resp.data.response));
        this.getNotificationConfig = (id) => this.http
            .get(`${this.url}/${id}/notification-config`)
            .then(resp => (0, adapter_1.notificationConfigAdapter)(resp.data.response));
        this.sendUpdatedActToShop = (taskId) => this.http
            .post(`${this.url}/task/${taskId}/act/send-updated-act-to-shop`, {})
            .then(resp => resp.data.response);
    }
}
exports.CleaningProjectService = CleaningProjectService;
exports.default = new CleaningProjectService();
//# sourceMappingURL=project.js.map