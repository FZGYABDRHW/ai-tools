export interface CreateContactPhone {
    contactPhone: string;
    internalCode: string | null;
}

export interface ContactPhone extends CreateContactPhone {
    id: number;
}

export enum Entity {
    ORGANIZATION = 'organization',
    SHOP = 'shop',
    EXECUTION_ADDRESS = 'client_execution_address',
}

export interface ContactPhonesByEntity {
    contact_phone: string;
    id: number;
    internal_code: string | null;
    related_entity: string;
    related_entity_id: string;
}

export interface ContactPhones {
    items: ContactPhone[];
    totalCount: number;
}
