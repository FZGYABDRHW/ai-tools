export interface CleaningPerformerTask {
    id: number;
    projectId: number;
    shopId: number;
    startDate: string | null;
    endDate: string | null;
    status: string | null;
}

export interface CleaningPerformerTaskList {
    items: CleaningPerformerTask[];
    totalCount: number;
}

export interface PerformerTaskListParams {
    performerId?: number;
    limit?: number;
    offset?: number;
    status?: string;
}

export type TaskCompensationStatus = 'deleted' | 'done' | 'new' | 'paid' | 'processing';

export type TaskCompensationType = 'consumable' | 'inventory';

export interface TaskCompensation {
    id: number;
    task_id: number;
    performer_id: number;
    project_category_id: number;
    accepted_user_id: number;
    type: TaskCompensationType;
    name: string;
    status: TaskCompensationStatus;
    organization_price: number;
    purchase_price: number;
    money_amount: number;
    amount: number;
    cashless: boolean;
    comment: string;
    delivery_date: string;
}
