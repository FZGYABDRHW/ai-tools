import { List } from '../../interfaces';

export interface DynamicStats {
    task_avg_time: number;
    tasks_count: number;
    tasks_in_time: number;
    tasks_in_time_perc: number;
    tasks_out_of_time: number;
    tasks_out_of_time_perc: number;
    interval: {
        month: number;
        type: string;
        value: number;
    };
}

export interface FinancesDynamicStats {
    expendables_costs: number;
    interval: {
        type: string;
        value: number;
        month: number;
    };
    services_costs: number;
    tasks_count: number;
    total_costs: number;
}

export interface DynamicVisits {
    interval: {
        type: string;
        value: number;
        month: number;
    };
    shops_count: number;
    visits_count: number;
}

export interface DynamicShopStats {
    expendables_costs: number;
    interval: {
        type: string;
        value: number;
        month: number;
    };
    services_costs: number;
    shops_count: number;
    total_costs: number;
}

export interface NumbersStats {
    avg_accept_category_time: number;
    avg_accept_expendable_time: number;
    avg_estimate_customer_approve_time: number;
    politeness: number;
    quality: number;
    task_stats: DynamicStats;
    top_categories: {
        category_amount: number;
        category_name: string;
        category_total: number;
        category_unit: string;
    }[];
    top_expendables: {
        expendable_amount: number;
        expendable_name: string;
        expendable_total: number;
    }[];
}

export interface ShopStats {
    coords: number[];
    shop_address: string;
    shop_id: number;
    shop_name: string;
    shop_total_costs: number;
    sub_organization_id: number;
    sub_organization_name: string;
    tasks_count: number;
}

export interface IncidentsStatisticsItem {
    id: number;
    name: string;
    incidentStatusesCount: {
        new: number;
        inWork: number;
        closed: number;
        completed: number;
        cancelled: number;
    };
}

export type IncidentsStatistics = List<IncidentsStatisticsItem>;

export interface IncidentsStatisticsQuery {
    limit?: number;
    offset?: number;
}
