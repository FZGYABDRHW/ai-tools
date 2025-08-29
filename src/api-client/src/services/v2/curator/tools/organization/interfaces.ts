export interface OrganizationsList {
    items: OrganizationInfo[];
    totalCount: number;
}

export interface OrganizationInfo {
    id: number;
    name: string;
    brand: string;
}
