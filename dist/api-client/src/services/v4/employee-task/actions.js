"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeTaskActionsService = void 0;
const BaseServiceV4_1 = __importDefault(require("../BaseServiceV4"));
const index_1 = __importDefault(require("./index"));
const interfaces_1 = require("./interfaces");
class EmployeeTaskActionsService extends BaseServiceV4_1.default {
    constructor() {
        super(...arguments);
        this.employeeTaskService = index_1.default;
        this.setArrivalDate = (id, date) => this.employeeTaskService.sendAction(id, { action: interfaces_1.SET_ARRIVAL_DATE_ACTION, date });
        this.resetPerformer = (id, reason, dispatchExcepted, saveExpendables, dateFrom, dateTo) => this.employeeTaskService.sendAction(id, {
            action: interfaces_1.RESET_PERFORMER_ACTION,
            reason,
            dispatchExcepted,
            saveExpendables,
            dateFrom,
            dateTo,
        });
        this.defer = (id, date, reason) => this.employeeTaskService.sendAction(id, { action: interfaces_1.DEFER_ACTION, date, reason });
        this.performerOnObject = (id) => this.employeeTaskService.sendAction(id, { action: interfaces_1.PERFORMER_ON_OBJECT_ACTION });
        this.complete = (id) => this.employeeTaskService.sendAction(id, { action: interfaces_1.COMPLETE_ACTION });
        this.markTaskCompleted = (id) => this.employeeTaskService.sendAction(id, { action: interfaces_1.MARK_TASK_AS_COMPLETED_ACTION });
        this.deferToTheActionsOfPerformer = (id, date) => this.employeeTaskService.sendAction(id, {
            action: interfaces_1.DEFER_TO_THE_ACTIONS_OF_PERFORMER_ACTION,
            date,
        });
        this.deferToTheActionsOfOrganization = (id, date) => this.employeeTaskService.sendAction(id, {
            action: interfaces_1.DEFER_TO_THE_ACTIONS_OF_ORGANIZATION_ACTION,
            date,
        });
        this.viewed = (id) => this.employeeTaskService.sendAction(id, { action: interfaces_1.VIEWED_ACTION });
        this.reassign = (id, assigneeId) => this.employeeTaskService.sendAction(id, { action: interfaces_1.REASSIGN_ACTION, assigneeId });
    }
}
exports.EmployeeTaskActionsService = EmployeeTaskActionsService;
exports.default = new EmployeeTaskActionsService();
//# sourceMappingURL=actions.js.map