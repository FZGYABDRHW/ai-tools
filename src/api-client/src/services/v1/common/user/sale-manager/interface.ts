export interface SaleManagerInfo {
    organizationName: number;
    salesManager: Manager;
}

export interface Manager {
    email: string;
    name: string;
    phone: number;
    photoId: number;
}
