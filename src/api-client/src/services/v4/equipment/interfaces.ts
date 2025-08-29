import { FileFromServer } from '../../interfaces';

export enum Condition {
    NEW = 'new',
    IN_WORK = 'working',
    WRITE_OFF = 'to_write_off',
}

export enum Category {
    CLIMATE = 'climate',
    ELECTRICITY = 'electricity',
    ELEVATOR = 'elevator',
    FIRE_SAFETY = 'fire_safety',
    IT = 'it',
    KITCHEN_AND_REFRIGERATE = 'kitchen_and_refrigerate',
    TRADE = 'trade',
    WAREHOUSE = 'warehouse',
    PLUMBING = 'plumbing',
}

export interface List<T> {
    items: ReadonlyArray<T>;
    totalCount: number;
}

export interface Equipment {
    id: number;
    shop_id: number | null;
    manufacturer_id: number | null;
    equipment_category: string;
    equipment_type_id: number | null;
    name: string;
    details: string | null;
    inventory_number: string | null;
    serial_number: string | null;
    manufacture_date: string | null;
    technical_condition: Condition | null;
    warranty_expiration_date: string | null;
    last_service_date: string | null;
}

export interface EquipmentParams {
    query?: string;
    shop_id?: number;
    category?: string;
    limit?: number;
    offset?: number;
}

export interface EquipmentCreate {
    id: number;
    shop_id: number;
    equipment_category: string;
    name: string;
    inventory_number?: string | null;
    equipment_type_id?: number | null;
    manufacturer_id?: number | null;
    technical_condition?: Condition | null;
    manufacture_date?: string | null;
    details?: string | null;
    serial_number?: string | null;
    file_ids?: Array<number>;
    image_ids?: Array<number>;
    warranty_expiration_date?: string | null;
}

export interface Manufacturer {
    id: number;
    title: string;
    organization_id: number;
}

export interface ManufacturerCreate {
    title: string;
    organization_id: number;
}

export interface EquipmentType {
    id: number;
    title: string;
    organization_id: number;
}

export interface EquipmentTypeCreate {
    title: string;
    organization_id: number;
}

export interface EquipmentListParams {
    shop_id?: number;
    category?: string;
    query?: string;
    limit?: number;
    offset?: number;
}

export interface MaintenanceHistoryParams {
    query?: string;
    limit?: number;
    offset?: number;
}

export type FilesResponse = FileFromServer[];
