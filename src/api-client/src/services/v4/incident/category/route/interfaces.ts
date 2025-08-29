export interface CreateRouteShopParams {
    category_id: number;
    contractor_company_id?: number;
    responsible_user_id?: number;
    shop_ids: number[];
}

export interface CreateRouteEquipmentParams {
    equipment_id: number;
    contractor_company_id?: number | null;
    responsible_user_id?: number | null;
}

export interface EquipmentRoute {
    category_id: number;
    equipment_id: number;
    contractor_company_id: number | null;
    responsible_user_id: number | null;
}

export interface RemoveRouteParams {
    routeId: number;
    shopId: number;
}
