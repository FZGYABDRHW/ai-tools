import BaseService from '../BaseServiceV4';
import EmployeeTaskService from './index';
import { DefferTodoReason } from './interfaces';
import {
    DEFER_ACTION,
    REASSIGN_ACTION,
    RESET_PERFORMER_ACTION,
    DEFER_TO_THE_ACTIONS_OF_ORGANIZATION_ACTION,
    DEFER_TO_THE_ACTIONS_OF_PERFORMER_ACTION,
    SET_ARRIVAL_DATE_ACTION,
    COMPLETE_ACTION,
    VIEWED_ACTION,
    PERFORMER_ON_OBJECT_ACTION,
    MARK_TASK_AS_COMPLETED_ACTION,
} from './interfaces';

export class EmployeeTaskActionsService extends BaseService {
    private employeeTaskService = EmployeeTaskService;

    public readonly setArrivalDate = (id: number, date: string) =>
        this.employeeTaskService.sendAction(id, { action: SET_ARRIVAL_DATE_ACTION, date });

    public readonly resetPerformer = (
        id: number,
        reason: number,
        dispatchExcepted: boolean,
        saveExpendables: boolean,
        dateFrom?: string,
        dateTo?: string,
    ) =>
        this.employeeTaskService.sendAction(id, {
            action: RESET_PERFORMER_ACTION,
            reason,
            dispatchExcepted,
            saveExpendables,
            dateFrom,
            dateTo,
        });

    public readonly defer = (id: number, date: string, reason?: DefferTodoReason) =>
        this.employeeTaskService.sendAction(id, { action: DEFER_ACTION, date, reason });

    public readonly performerOnObject = (id: number) =>
        this.employeeTaskService.sendAction(id, { action: PERFORMER_ON_OBJECT_ACTION });

    public readonly complete = (id: number) =>
        this.employeeTaskService.sendAction(id, { action: COMPLETE_ACTION });

    public readonly markTaskCompleted = (id: number) =>
        this.employeeTaskService.sendAction(id, { action: MARK_TASK_AS_COMPLETED_ACTION });

    public readonly deferToTheActionsOfPerformer = (id: number, date: string) =>
        this.employeeTaskService.sendAction(id, {
            action: DEFER_TO_THE_ACTIONS_OF_PERFORMER_ACTION,
            date,
        });

    public readonly deferToTheActionsOfOrganization = (id: number, date: string) =>
        this.employeeTaskService.sendAction(id, {
            action: DEFER_TO_THE_ACTIONS_OF_ORGANIZATION_ACTION,
            date,
        });

    public readonly viewed = (id: number) =>
        this.employeeTaskService.sendAction(id, { action: VIEWED_ACTION });

    public readonly reassign = (id: number, assigneeId: number) =>
        this.employeeTaskService.sendAction(id, { action: REASSIGN_ACTION, assigneeId });
}

export default new EmployeeTaskActionsService();
