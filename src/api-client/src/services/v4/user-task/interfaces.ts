export enum UserTaskType {
    CONTRACTOR_SET_ARRIVAL_DATE = 'type_set_performer_arrival_date_on_object',
    CONTRACTOR_ARRIVE_IN_TIME = 'type_performer_arrive_on_object',
}

export interface UserTask {
    id: number;
    userId: number;
    type: string;
    status: string;
    result: string;
    priority: number;
    relatedEntity: {
        id: number;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
    deferredTo: string;
    description: string | null;
}
