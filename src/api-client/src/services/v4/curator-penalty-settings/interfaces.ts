export enum KPIType {
    COMPLETED_TASKS = 'kpi_type_completed_tasks',
    AVG_TIME_CLOSED_IT = 'kpi_type_avg_time_closed_it',
    AVG_TIME_CLOSED_MAINTENANCE = 'kpi_type_avg_time_closed_maintenance',
    AVG_TECHNICAL_SUPPORT_RATING = 'kpi_type_avg_technical_support_rating',
}

export enum TargetType {
    PERSONAL = 'target_type_personal',
    TEAM = 'target_type_team',
}

export interface Settings {
    id: number;
    kpiType: string;
    targetType: string;
    threshold: number;
    penalty: number;
}
