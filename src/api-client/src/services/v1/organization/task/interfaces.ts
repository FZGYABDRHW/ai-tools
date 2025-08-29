import { Shop } from '../shop/interfaces';
import { PriceWithCurrency } from '../../../interfaces';

export interface Requirement {
    id: number;
    name: string;
    description: string;
    type: number;
}

export interface Response {
    items: Requirement[];
}

export interface Task {
    id?: number;
    name: string;
    description?: string;
    departmentId?: number;
    hiddenDescription?: string;
    contract_id?: number;
    contactData: { name?: string; phone?: number };
    uploadedFiles: File[];
    personal?: Personal;
    selectedCategoryId?: number;
    selectedServices: Service[];
    selectedServicesPrice?: number;
    additionalRequirements?: string[];
    selectedShop: Partial<Shop>;
    organizationId?: number;
    night: boolean;
    urgent: boolean;
    isAltitudeWorkExists: boolean;
    isArriveOnTimeRequired: boolean;
    beginDate: Date;
    closeDate?: Date;
    shop?: Partial<Shop>;
    personalUserId?: number;
    organizationAttachments?: Array<File>;
    activeCoefficients?: AdditionalOpportunities;
    departments?: Department[];
    department?: Department;
    departmentCredit?: boolean;
    additionalRequirement?: string;
}

export interface Personal {
    id: number;
    name: string;
    photo: string;
    photo_id: number;
    rating: number;
}

export interface File {
    GPS?: {
        exist: boolean;
    };
    display_name?: string;
    id?: number;
    is_viewed_by_user?: boolean;
    mime?: string;
    model?: number;
    size?: string;
    type?: number;
    uploadId?: number;
    upload_date?: string;
    url?: string;
}

export interface Department {
    id?: number;
    name?: string;
    balance?: string;
    balanceWithCurrency?: PriceWithCurrency;
    instruction?: string;
}

export interface AdditionalOpportunities {
    night?: boolean;
    urgent?: boolean;
}

export interface Incident {
    id: number;
}

export interface Service {
    amount?: number;
    description?: string;
    id?: number;
    multipliedPrice?: number;
    name?: string;
    not_blocking?: boolean;
    parent_id?: number;
    price?: number;
    priceWithCurrency?: PriceWithCurrency;
    root?: number;
    type: number;
    singlPrice?: number;
    sla?: number;
    without_allowance?: boolean;
    incidents?: Incident[];
}

export interface MessageConfirm {
    message: string;
    type: number;
}

export interface ParamsRatingTask {
    politeness?: number;
    quality?: number;
    addToFavorite?: boolean;
    comment?: string;
}

export interface TaskInfo {
    performer: PerformerInfo;
    isFavorite: boolean;
    shopRating: ShopRatingInfo;
    shop: ShopInfo;
    organization: OrganizationManager;
}

export interface OrganizationManager {
    salesManager: {
        first_name: string;
        photo_id: number;
        second_name: number;
    };
}

export interface PerformerInfo {
    name: string;
    rating: number;
    photo_id: number;
}

export interface ShopRatingInfo {
    id: number;
    quality: number;
    politeness: number;
    is_not_done: boolean;
    total: number;
}

export interface ShopInfo {
    contact_mail: string;
    assessRating: boolean;
}

export interface Price {
    additional_works: {
        urgent: AdditionalWorks;
        night: AdditionalWorks;
        altitudeWork: AdditionalWorks;
        arriveOnTime: AdditionalWorks;
    };
    minimal_organization_price: number;
    minimal_organization_price_with_currency: PriceWithCurrency;
    minimal_performer_price: number;
    minimal_performer_price_with_currency: PriceWithCurrency;
    tree: {
        childs: Child[];
        description: string;
        has_subcategories: boolean;
        id: number;
        img_id: number;
        img_url: string;
        name: string;
        not_blocking: boolean;
        parent_id: number;
        price: number;
        priceWithCurrency: PriceWithCurrency;
        root: number;
        sla: number;
        without_allowance: boolean;
    };
}

export interface AdditionalWorks {
    name: string;
    price: number;
    priceWithCurrency: PriceWithCurrency;
}

export interface Child {
    description: string;
    id: number;
    name: string;
    not_blocking: boolean;
    parent_id: number;
    price: number;
    root: number;
    sla: number;
    without_allowance: boolean;
}
