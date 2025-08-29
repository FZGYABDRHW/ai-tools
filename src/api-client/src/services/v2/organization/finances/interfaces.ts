import { PriceWithCurrency } from '../../../interfaces';
import { BaseListParams } from '../../../v4/organization/contractor-company/interfaces';

export enum BillStatus {
    PAID = 'paid',
    CANCELLED = 'cancelled',
    NOT_PAID = 'not_paid',
    PARTIALLY_PAID = 'partially_paid',
    OVERPAYMENT = 'overpayment',
}

export enum DocumentStatus {
    CREATED = 'created',
    PREPARED = 'prepared',
    ON_APPROVAL = 'onApproval',
    APPROVED = 'approved',
    NOT_APPROVED = 'notApproved',
    SENT = 'sent',
    SIGNED = 'signed',
    REJECTED = 'rejected',
    CANCELLED = 'cancelled',
}

export enum DeliveryType {
    EMAIL = 'email',
    MAIL = 'mail',
    EDMS = 'edms',
}

export enum DownloadType {
    INVOICE = 1,
    BILL = 2,
    ACT = 3,
    TITLE = 4,
    ARCHIVE = 5,
    ESTIMATE = 6,
    REPORT = 7,
}

export enum DownloadFormat {
    PDF = 'pdf',
    XLS = 'xls',
    ZIP = 'zip',
}

export interface FinancesRequestParams {
    month?: number;
    year?: number;
    status?: BillStatus;
    limit: number;
    offset: number;
}

export interface DownloadFileRequestParams {
    packId: number;
    documentType: number;
    documentFormat: string;
}

export interface Finances<T> {
    models: T[];
    totalModelsCount: number;
}

export interface Branch {
    id: number;
    name: string;
}

export interface EntityLink {
    id: number | null;
    name: string | null;
}

export interface FinancesModel {
    id: number;
    packName: string;
    status: string;
    suborganizationId: number;
    suborganizationName: string;
    departmentId: number;
    documentDate: string;
    sum: number;
    vatSum: number;
    downloads: File[];
    branch: Branch | null;
}

export interface File {
    type: number;
    format: string;
}

export interface Bill extends FinancesModel {
    paymentDate: string;
    vatSumPayed: number;
    canBeCancelled: boolean;
}

export interface Act extends FinancesModel {
    departmentName: string;
}

export interface PaymentDocumentDownloads {
    type: DownloadType;
    format: DownloadFormat;
}

export interface PaymentDocument {
    id: number;
    status: BillStatus;
    suborganization: EntityLink;
    department: EntityLink;
    branch: EntityLink;
    contract: EntityLink;
    document_number: string | null;
    document_date: string;
    document_status: DocumentStatus | null;
    document_status_updated_at: string | null;
    payment_date?: string;
    planed_pay_date: string | null;
    sum: PriceWithCurrency;
    vat: PriceWithCurrency;
    vat_sum: PriceWithCurrency;
    vat_sum_payed: PriceWithCurrency;
    delivery_type: DeliveryType | null;
}

export interface PaymentDocumentList {
    items: PaymentDocument[];
    totalCount: number;
}

export interface PaymentDocumentListParams extends BaseListParams {
    suborganization_id?: number;
    department_id?: number;
    branch_id?: number;
    status?: BillStatus;
    date_from?: string;
    date_to?: string;
}

export interface TotalDebt {
    sum: PriceWithCurrency;
    vat: PriceWithCurrency;
    vat_sum: PriceWithCurrency;
}

export interface TotalDebtList {
    items: TotalDebt[];
    totalCount: number;
}

export interface TotalDebtListParams extends BaseListParams {
    date_from?: string;
    date_to?: string;
    suborganization_id?: number;
    department_id?: number;
    branch_id?: number;
}
