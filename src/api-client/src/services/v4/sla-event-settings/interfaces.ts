export type EventGroupType = 'group_event_global' | 'group_todo_performer_plan_arrival';
export type ParamType = 'param_sla' | 'param_sla_success_rating' | 'param_sla_failed_rating';

export enum SLAEventGroup {
    GLOBAL = 'group_event_global',
    CONTRACTOR_TODO_PLAN_ARRIVAL = 'group_todo_performer_plan_arrival',
}

export enum RelatedEventEntity {
    EVENT_CONTRACTOR_ADD_ARRIVAL = 'event_performer_add_depart',
    EVENT_CONTRACTOR_ARRIVE_TO_SHOP = 'event_performer_arrive_to_shop',
}

export enum EventParam {
    SUCCESS_RATING = 'param_sla_success_rating',
    SLA = 'param_sla',
}

export interface SLAEventSettings {
    id: number;
    group: string;
    relatedEntity: string;
    relatedEntityEvent: string;
    param: ParamType;
    value: string;
}
