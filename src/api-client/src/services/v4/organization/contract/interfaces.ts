import { MaxEstimateCostWithoutApprove } from '../interfaces';

export interface Contract {
    id: number;
    number: string;
    conclusionDate: string;
    name: string;
    stampName: string;
    comment: string;
    organizationId: number;
    suborganizationId: number;
    franchiseId: number;
    franchiseBankAccountId: number;
    active: boolean;
    priceListId: number;
    paymentType: string;
    personalCoefficient: number;
    commissionForItService: number;
    regionalCoefficientListId: number;
    regionalCoefficientEnable: boolean;
    deliveryExpendablesEnable: boolean;
    minimalTaskPriceForOrganization: number;
    minimalTaskPriceForPerformer: number;
    maxEstimateCostWithoutApprove: MaxEstimateCostWithoutApprove;
    isBlocked: boolean;
    incidentUsageConfig: IncidentUsageConfig;
    formatOfClosingDocuments: string[];
    aggregationInClosingDocuments: string[];
    templateOfClosingDocuments: string[];
    additionalReportsAndDocuments: string[];
    preActEnable: boolean;
    edo: string[];
    departments: number[];
}

export enum IncidentUsageConfig {
    Disabled = 'disabled',
    Enable = 'enable',
    Required = 'required',
}

export interface Vat {
    vat: number;
}

export interface Branch {
    id: number;
    organizationId: number;
    name: string;
    isDeleted: boolean;
}

export enum PaymentType {
    credit = 'credit',
    advance = 'advance',
}

export interface ListParams {
    ids?: number[];
    suborganizationId?: number;
    departmentId?: number;
    limit?: number;
    offset?: number;
}

export interface PriceTreeParams {
    shopId?: number;
    lat?: number;
    lng?: number;
    polygonId?: number;
}
