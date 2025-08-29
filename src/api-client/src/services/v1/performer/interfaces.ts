import { PriceWithCurrency } from '../../interfaces';
import { CommissionInfo } from '../curator/performer/interfaces';

export const NEW_TASK = 'new';
export const AWAITING_APPROVE_TASK = 'awaitingApprove';
export const IN_WORK_TASK = 'inWork';
export const DONE_TASK = 'done';
export const REJECTED_TASK = 'rejected';
export const ON_CUSTOMER_APPROVAL = 'onCustomerApproval';

export enum RatingType {
    CONTRACTOR_COMMON,
    TASK_RATING,
    REPORT,
    TASK_UNASSIGN,
    BAN,
    PERFORMER_REFUSE,
}

export enum InvoiceStatuses {
    NO_CHOSEN = 'noChosen',
    NOT_ATTACHED = 'notAttached',
    ON_CURATOR_MODERATION = 'onCuratorModeration',
    APPROVED = 'approved',
}

export interface Rating {
    quality: number;
    politeness: number;
    speed: number;
}

export interface MessageConfirm {
    message: string;
    type: number;
}

export enum STATUS_INVOICING {
    Progress = 'in_progress',
    Completed = 'completed',
    Fault = 'fault',
    Canceled = 'canceled',
}

export interface RatingTotal {
    quality?: number;
    politeness?: number;
    speed?: number;
    total?: number;
}

export interface IRating extends RatingTotal {
    tasks_count?: number;
    better_than?: number;
}

export interface IRatingHistoryItem {
    created_at: string;
    deleted_at: number;
    deletingUser: {
        id: number;
        name: string;
    };
    entity_id: number;
    entity_name: string;
    id: number;
    rating: Rating;
    ratingChange: number;
    ratingTotalDiff: number;
    type: number;
    text: string;
}

export interface IRatingHistory {
    items: IRatingHistoryItem[];
    totalCount: number;
}

export interface ITasksLimit {
    limit: number;
}

export type TaskListParams = {
    userId?: number;
    text?: string;
    personal?: boolean;
    night?: boolean;
    urgent?: boolean;
    unread?: boolean;
    offset?: number;
    status?: number;
    limit?: number;
    withUserSkills?: number;
    performerTaskInvoiceStatus?: InvoiceStatuses;
};

export type TasksInfo = {
    awaitingApprove: number;
    done: number;
    inWork: number;
    new: number;
    rejected: number;
};

export interface IPerformerPopup {
    type: number;
    viewed: boolean;
    task: {
        id: number;
        name: string;
        address: string;
        logo_id: number;
        cost: number;
    };
    organizationRating: Rating;
    currentUserRating: {
        RatingTotal;
        tasks_count: number;
        better_than: number;
    };
    changesUserRating: RatingTotal;
    message: string;
    created_at: string;
}

export interface PerformerWallet {
    balance: number;
    balance_with_currency: PriceWithCurrency;
    operations: Operation[];
}

export enum WalletActionTypes {
    EXPANDABLE_CONFIRM = 1,
    EXPANDABLE_ADJUSTMENT = 2,
    TASK_CLOSED = 3,
    PAYOUT = 4,
    RETURNING_MONEY_FOR_PAYOUT = 5,
    MANUAL_PAYMENT = 6,
    EXPENDABLE_DELETE = 7,
    EXPENDABLE_CORRECTION_UP = 8,
    MANUAL_PAYOUT = 9,
    EXPENDABLE_CORRECTION_DOWN = 10,
    EXPENDABLE_MAKE_CASHLESS = 11,
    EXPANDABLE_PAYOUT = 12,
    MANUAL_EXPENDABLE_PAYMENT = 13,
    MANUAL_EXPENDABLE_PAYOUT = 14,
    EXPENDABLE_MAKE_COMMON = 15,
    INCREASE_IE_WALLET_USING_WORK_WALLET = 16,
    INCREASE_IE_WALLET_USING_EXPENDABLE_WALLET = 17,
    DECREASE_WORK_WALLET_AFTER_MOVING_TO_IE = 18,
    DECREASE_EXPENDABLE_WALLET_AFTER_MOVING_TO_IE = 19,
    CLEANING_CALENDAR_PLAN_CATEGORY_PAYMENT = 20,
    CLEANING_CALENDAR_PLAN_COMPENSATION_PAYMENT = 21,
    CLEANING_INVENTORY_PAYMENT = 22,
    DECREASE_IE_WALLET_AFTER_REVOKE_IE_PROFILE = 23,
    INCREASE_WORK_WALLET_AFTER_REVOKE_IE_PROFILE = 24,
    MOTIVATION_REWARD = 25,
    INCREASE_WALLET_AFTER_BALANCE_MOVE = 26,
    DECREASE_WALLET_AFTER_BALANCE_MOVE = 27,
    DECREASE_WALLET_WITHHOLDING_TAX = 28,
}

export interface Operation {
    access_token: string;
    account: string;
    add_date: string;
    annotation: string;
    backup_wallet: string;
    backup_wallet_with_currency: PriceWithCurrency;
    curator_id: number;
    id: number;
    money_amount: string;
    commission: CommissionInfo;
    money_amount_with_currency: PriceWithCurrency;
    moneyback: boolean;
    operation_type: string;
    payment_id: number;
    payment_system_type: string;
    performer_wallet_franchise_id: number;
    performer_wallet_id: number;
    receipt: Receipt;
    status: string;
    task_id: number;
    text: string;
    type: number;
    user_id: number;
}

export interface Receipt {
    receipt_link: string;
    status: string;
    income_error: string;
}

export interface PerformerTaskResponse {
    models: ReadonlyArray<PerformerTask>;
    totalModelsCount: number;
}

export interface PerformerTask {
    additional_requirement: boolean;
    commentsCount: number;
    curator: {
        id: number;
        name: string;
        photo: string;
        photo_id: number;
    };
    description: string;
    gmt: string;
    id: number;
    name: string;
    newCommentsCount: number;
    night: boolean;
    organization: {
        id: number;
        logo: string;
        logo_id: number;
        name: string;
        small_logo_id: number;
    };
    personal: boolean;
    price: number;
    shop: {
        id: number;
        name: string;
        address: string;
        coords: ReadonlyArray<number>;
    };
    status: string;
    timing: {
        begin_date: string;
        changing_date: string;
        create_date: string;
        inwork_date: string;
        organization_confirm_date: string;
        performer_close_date: string;
        plan_close_date: string;
    };
    urgent: boolean;
    isDynamicPrice: boolean;
}
