import { PriceWithCurrency } from '../../../../interfaces';

export interface ShopData {
    name: string;
    address_name: string;
    address_original: string;
    city: string;
    adjoined_area_size: number;
    area_size: string;
    city_distance: string;
    client_shop_id: string;
    kpp: string;
    contact_mail: string;
    contact_name: string;
    contact_phone: string;
    contact_phone_additional: string;
    description: string;
    files: any;
    geocoder_precision: number;
    id: number;
    pointCenterFlippedCoordinatesJson: string;
    schedule: WorkTime;
    suborganization: Suborganization;
    shop_branch: ShopBranch;
    polygon: Polygon;
}

export interface ShopBranch {
    id?: number;
    organization_id?: number;
    name?: string;
    created_at?: string;
    deleted_at?: string;
    is_deleted?: number;
}

export interface Polygon {
    geometryJson: string;
    id: number;
}

export interface WorkTime {
    weekdays: Weekdays;
    weekend: Weekdays;
}

export interface Weekdays {
    from: string;
    to: string;
}

export interface Suborganization {
    name: string;
}

export interface ShopTasksHistory {
    totalCount: number;
    items: ShopTask[];
}

export interface ShopTask {
    id: number;
    name: string;
    urgent: boolean;
    night: boolean;
    price: number;
    priceWithCurrency: PriceWithCurrency;
    planCloseDate: string;
    beginDate: string;
    performer: Performer;
}

export interface Performer {
    id: number;
    photo_id: number;
    name: string;
}

export interface ShopList {
    totalCount: number;
    items: ReadonlyArray<Shop>;
}

export interface Shop {
    id: number;
    organization_id: number;
    name: string;
    city_name: string;
    address_name: string;
    city_polygon_id: number;
    city_distance: number;
    geocoder_precision: number;
    validation_address_id: number;
}
