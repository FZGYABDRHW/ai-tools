export interface CommentsParams {
    limit?: number;
    offset?: number;
    task_id?: number;
    team_id?: number;
    curator_id?: number;
    organization_user_only?: boolean;
}

export interface CuratorInfo {
    id: number;
    name: string;
    photo_id: number;
}

export interface Comment {
    task_id: number;
    text: string;
    create_date: string;
    curator: CuratorComment;
    performer: PerformerComment;
}

interface PerformerComment {
    id: string;
    fullName: string;
}

interface CuratorComment {
    id: string;
    fullName: string;
}

export interface ShopData {
    name: string;
    address_name: string;
    address_original: string;
    city: string;
    area_size: string;
    city_distance: string;
    client_shop_id: null;
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

export interface Weekdays {
    from: number;
    to: number;
}

export interface WorkTime {
    weekdays: Weekdays;
    weekend: Weekdays;
}

export interface Suborganization {
    name: string;
}

export interface ShopTasksHistory {
    totalCount: number;
    items: ShopTasks;
}

export interface ShopTasks {
    id: number;
    name: string;
    urgent: boolean;
    night: boolean;
    price: number;
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
    address_name: string;
    city_name: string;
    city_polygon_id: number;
    city_distance: number;
    geocoder_precision: number;
    validation_address_id: number;
    consider_area_check: {
        reason: string;
        disabled: boolean;
    };
    contract_shop_check: boolean;
}

export interface GetShopListParams {
    organization_id: number;
    limit: number;
    offset: number;
    is_deleted: boolean;
    category_id: number;
    contract_ids: string;
}

export interface UpdateClientPosition {
    executionAddressId: number;
    lat: number;
    lon: number;
}
