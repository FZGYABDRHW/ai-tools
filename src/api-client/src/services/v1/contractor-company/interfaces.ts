export interface ShopListParams {
    limit?: number;
    offset?: number;
    query?: string;
}

export interface Shop {
    id: number;
    address_name: string;
    name: string;
}

export interface ShopList {
    items: Shop[];
    totalCount: number;
}
