import { PriceWithCurrency } from '../../../interfaces';

export interface Shop {
    address_name: string;
    timezone_offset: string;
    coefficients?: {
        organization_personal_coef: number;
        payment_type_coef: number;
        regional_coef: number;
    };
    contact_name: string;
    contact_phone: number;
    description: string;
    id: number;
    name: string;
    schedule: {
        weekdays: WorkTime;
        weekend: WorkTime;
    };
    suborganization_id?: number;
    suborganization_name?: string;
    use_suborganization_from_contract?: boolean;
    branchId?: number;
}

export interface Resp {
    models: Shop[];
    total: number;
}

export interface WorkTime {
    from: string;
    to: string;
}

export interface ShopQuery {
    limit?: number;
    offset?: number;
    query?: string;
    shopId?: number;
    byUserDepartmentOrBranch?: boolean;
}

export interface ShopTask {
    performerPhoto: string;
    name: string;
    isUrgent: boolean;
    isNight: boolean;
    beginDate: string;
    planCloseDate: string;
    price: string;
    priceWithCurrency: PriceWithCurrency;
}
