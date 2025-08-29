
interface Organization {
    id: number;
    name: string;
    type: string;
    marginality: string;
    brand: string;
}

interface Suborganization {
    id: number;
    name: string;
    name_official: string;
    juridical_address: string;
    country: string;
    is_deleted: boolean;
    organization_id: number;
}

export interface SupplierApiAnswer {
    organization: Organization;
    suborganization: Suborganization;
}

export interface Supplier {
    name: string;
    main_identifier: string;
    additional_identifier?: string;
    legal_address: string;
    description: string | null;
    vat_rate: number | null;
}
