export enum RepeatConfigType {
    MONTH = 'month',
}

export interface RepeatConfig {
    type: RepeatConfigType;
    interval: number;
}

export interface ScheduleListQuery {
    query?: string;
    equipment_category?: string;
    shop_id?: number;
    limit?: number;
    offset?: number;
    next_maintenance_date_from?: string;
    next_maintenance_date_to?: string;
}

export interface ScheduleList {
    items: { id: number }[];
    totalCount: number;
}

export interface ComposedScheduleList {
    items: ReadonlyArray<ComposedScheduleItem>;
    totalCount: number;
}

export interface Schedule {
    incident_template_id: number;
    equipmentId: number;
    incident_next_creation_date: string;
    repeat_config: RepeatConfig;
}

export interface ComposedSchedule extends Schedule {
    id: number;
}

export interface ScheduleTemplate {
    id: number;
    name: string;
    description: string;
    file_ids: number[];
}

export interface IncidentScheduleEquipment {
    id: number;
    name: string;
}

export interface IncidentScheduleShop {
    id: number | null;
    address: string;
}

export interface ComposedScheduleItem {
    id: number;
    scheduleName: string;
    equipment: IncidentScheduleEquipment;
    shop: IncidentScheduleShop;
    lastDate: string;
    nextDate: string;
    frequency: number;
}

export interface CreateSchedule {
    incident_template_id: number;
    equipment_id: number;
    repeat_config: RepeatConfig;
}

export interface CreateScheduleTemplateQuery {
    name: string;
    description: string;
    file_ids: number[];
}

export interface CreateScheduleQuery {
    items: CreateSchedule[];
}
