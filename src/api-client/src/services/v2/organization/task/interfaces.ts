export interface Tabs {
    new: number;
    inWork: number;
    awaitingApprove: number;
    done: number;
    canceled: number;
    onModeration: number;
    rejected: number;
}

export interface Task {
    id: number;
    name: string;
    gmt: string;
    organization_user_id: number;
    description: string;
    timing: Timing;
    price: number;
    shop: Shop;
    night: boolean;
    urgent: boolean;
    personal: boolean;
    commentsCount: number;
    actionExpected: boolean;
    newCommentsCount: number;
    status: number;
}

export interface Timing {
    create_date: string;
    begin_date: string;
    inwork_date: string;
    plan_close_date: string;
    performer_close_date: string;
    organization_confirm_date: string;
    changing_date: string;
}

export interface Shop {
    id: number;
    name: string;
    address: string;
}
