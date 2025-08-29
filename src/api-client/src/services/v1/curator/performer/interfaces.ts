import { Receipt } from '../../performer/interfaces';
import { PriceWithCurrency } from '../../../interfaces';

export interface CommissionInfo {
    commission_percent: number | null;
    description: string | null;
    commission_money_amount: PriceWithCurrency | null;
    money_amount_after_commission: PriceWithCurrency | null;
    amount_transferring_commission: PriceWithCurrency | null;
    min_money_amount_without_commission: PriceWithCurrency | null;
}

export interface Transactions {
    items: Transaction[];
    totalCount: number;
}

export interface Transaction {
    id: number;
    text: string;
    add_date: string;
    operationType: string;
    task_id: number;
    payment_system_type: string;
    accountNumber: string;
    annotation: string;
    money_amount: number;
    type: number;
    curator: Curator;
    receipt: Receipt;
    commission: CommissionInfo;
}

export interface Curator {
    name: string;
}

export interface PassportStatus {
    is_viewable: boolean;
    status: number;
    status_alias: string;
    reason: string;
}

export enum Status {
    STATUS_REJECTED = 1,
    STATUS_REQUESTED,
    STATUS_NOT_REQUESTED,
    STATUS_APPROVED,
}

export interface Annotations {
    common?: boolean;
    delete?: boolean;
    report?: boolean;
    unassign?: boolean;
    limit?: boolean;
    offset?: boolean;
}
