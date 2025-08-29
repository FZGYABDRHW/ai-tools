export interface Curator {
    id: number;
    name: string;
}

export interface Organization {
    brand: string;
    coef: number;
    description: string;
    id: number;
    is_blocked: number;
    logo_id: number;
    name: string;
    payment_type: number;
    phone: number;
    problematic_arrears: boolean;
    registration_date: string;
    shop_fields: boolean;
    small_logo_id: number;
    url: string;
}

export interface OrganizationResponse {
    items: Organization[];
    totalCount: number;
}
