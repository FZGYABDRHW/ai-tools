export interface Params {
    year: number;
    month: number;
    curatorId: number;
    id?: number;
}

export interface BonusInfo {
    bonuses: Bonuses;
    c2: number;
    inTimePercent: number;
    month: string;
    tasksCanceledImportant: number;
    tasksCanceledRegular: number;
    teamPlanPercent: number;
    total: Total;
    year: string;
}

export interface Total {
    bonus: number;
    task_count: number;
}

export interface Bonuses {
    begin_date: string;
    bonus: number;
    bonus_team_fee: number;
    calculated_price_expendables: string;
    calculated_price_organization: string;
    calculated_price_performer: string;
    changing_date: string;
    changing_date_reason: string;
    contact_name: string;
    contact_phone: number;
    create_date: string;
    curator_id: number;
    curator_name: string;
    curator_take_date: string;
    curator_visit_date: string;
    department_id: number;
    description: string;
    expensive_expendables: string;
    gmt: string;
    hidden_description: string;
    hunter_id: number;
    id: number;
    inwork_date: string;
    is_urgent: boolean;
    name: string;
    new_client: boolean;
    newbie_curator: boolean;
    nightwork_coef: string;
    organization_confirm_date: string;
    organization_id: number;
    organization_personal_coef: string;
    organization_user_closed_tasks_count: number;
    organization_user_id: number;
    overdue: boolean;
    passed_to_hunter: boolean;
    payment_type_coef: string;
    performer_close_date: string;
    performer_id: number;
    performer_plan_arrival_date: string;
    personal_user_id: number;
    plan_close_date: string;
    region_coef: string;
    shop_id: number;
    status: number;
    suborganization_id: number;
    suborganization_id_new: number;
    suborganization_id_old: number;
    timezone: string;
    type: number;
    urgentwork_coef: string;
}
