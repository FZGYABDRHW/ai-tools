import { PriceWithCurrency } from '../../../interfaces';

export enum AdditionalWorkType {
    NIGHT = 'night',
    URGENT = 'urgent',
    ARRIVE_ON_TIME = 'arriveOnTime',
    ALTITUDE_WORK = 'altitudeWork',
}

export type AdditionalWork = {
    name: string;
    price: number;
    priceWithCurrency: PriceWithCurrency;
};
export type AdditionalWorks = { [key in AdditionalWorkType]: AdditionalWork };

export interface List {
    id: number;
    name: string;
}

export interface Price {
    additional_works: AdditionalWorks;
    minimal_organization_price: number;
    minimal_performer_price: number;
    tree: TreeServices[];
}

export interface TreeServices {
    childs: TaskService[];
    description: string;
    has_subcategories: boolean;
    id: number;
    img_id: number;
    img_url: string;
    name: string;
    not_blocking: boolean;
    parent_id: number;
    price: number;
    priceWithCurrency: PriceWithCurrency;
    root: number;
    sla: number;
    type: number;
    without_allowance: boolean;
}

export interface TaskService {
    childs: TaskService[];
    description: string;
    id: number;
    name: string;
    not_blocking: boolean;
    parent_id: number;
    price: number;
    priceWithCurrency: PriceWithCurrency;
    root: number;
    sla: number;
    without_allowance: boolean;
}

export interface TaskTitle {
    task_id: number;
    name: string;
}

export interface TaskDescriptions {
    task_id: number;
    description: string;
    hidden_description?: string;
}
