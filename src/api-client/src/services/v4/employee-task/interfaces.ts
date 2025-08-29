export const PERFORMER_ON_OBJECT_ACTION = 'performer_on_object',
    COMPLETE_ACTION = 'complete',
    MARK_TASK_AS_COMPLETED_ACTION = 'mark_task_as_completed',
    DEFER_TO_THE_ACTIONS_OF_PERFORMER_ACTION = 'defer_to_the_actions_of_performer',
    DEFER_TO_THE_ACTIONS_OF_ORGANIZATION_ACTION = 'defer_to_the_actions_of_organization',
    VIEWED_ACTION = 'viewed',
    SET_ARRIVAL_DATE_ACTION = 'set_arrival_date',
    RESET_PERFORMER_ACTION = 'reset_performer',
    DEFER_ACTION = 'defer',
    REASSIGN_ACTION = 'reassign';

export const AWAIT_COMMENT_FROM_ORGANIZAION_REASON = 'await_comment_from_organization';

export const RELATED_ENTITY_TICKET = 'ticket',
    RELATED_ENTITY_TASK = 'task',
    RELATED_ENTITY_TASK_EXPENDABLE = 'task_expendable',
    RELATED_ENTITY_TASK_CLEANING = 'cleaning.task',
    RELATED_ENTITY_TASK_CLEANING_CALENDAR_PLAN = 'cleaning.calendar_plan';

export type RelatedEntityType = 'ticket' | 'task';

export const enum TodoType {
    SET_PERFORMER_ARRIVAL_DATE_ON_OBJECT = 1,
    CONTROL_PERFORMER_ARRIVAL_ON_OBJECT,
    CHECK_PERFORMER_ARRIVAL_DATE,
    NEW_COMMENT_ON_TASK,
    ESTIMATE_CURATOR_MODERATE,
    ESTIMATE_PURCHASING_MANAGER_MODERATE,
    PURCHASE_EXPENDABLES,
    TICKET,
    CHECK_TASK_STATUS,
    FIND_PERFORMER,
    ESTIMATE_ON_CUSTOMER_APPROVAL,
    APPROVE_CLOSING_TASK,
    CONTROL_EXPENDABLES_DELIVERY,
    CONTROL_PERFORMER_TASK_DONE,
    INSTRUCTIONS_TO_NEW_CONTRACTOR,
    CLIENT_CALL_FAILED,
    FIND_PERFORMER_CLEANING,
    NOBODY_CLEANED,
    CONTROL_PERFORMER_CLEANING,
    B2B2C_CURATOR_MODERATE,
    INSTRUCTIONS_TO_NEW_CONTRACTOR_ON_SITE,
    NEW_COMMENT_ON_TASK_CLEANING,
    HELP_HUNTER_WITH_TASK,
    PERFORMER_CALL_FAILED,
}

export interface EmployeeTask {
    id: number;
    userId: number;
    authorId: number;
    triggerType: number;
    description: string;
    type: number;
    status: number;
    result: number;
    priority: number;
    relatedEntity: {
        id: number;
        name: RelatedEntityType;
    };
    deferredCount: number;
    deferredFrom: string;
    deferredReason: number;
    deferredTo: string;
    createdAt: string;
    closedAt: string;
    updatedAt: string;
    deferredAt: string;
}

export interface ListParams {
    limit: number;
    offset: number;
}

export interface Action {
    action:
        | 'set_arrival_date'
        | 'reset_performer'
        | 'defer'
        | 'performer_on_object'
        | 'complete'
        | 'answer'
        | 'defer_to_the_actions_of_performer'
        | 'defer_to_the_actions_of_organization'
        | 'viewed'
        | 'reassign'
        | 'mark_task_as_completed';
    date?: string;
    reason?: string | number;
    saveExpendables?: boolean;
    dispatchExcepted?: boolean;
    comment?: string;
    dateFrom?: string;
    dateTo?: string;
    assigneeId?: number;
}

export interface FullListParams {
    limit: number;
    offset: number;
    status?: number;
    curatorId: number;
    teamId?: number;
}

export interface Statisctic {
    avgCompleteTime: number;
    activeCount: number;
    deferredCount: number;
}

export type DefferTodoReason =
    | 'await_comment_from_organization'
    | 'await_comment_from_performer'
    | 'await_approval_of_estimate'
    | 'await_pass_to_object'
    | 'await_payment_for_expendables'
    | 'await_provisioner_answer'
    | 'await_information_from_performer'
    | 'await_payment_transfer_to_performer'
    | 'await_delivery_of_expendables';
