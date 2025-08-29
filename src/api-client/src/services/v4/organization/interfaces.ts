import { TaskStatus } from '../task/interfaces';
import { IncidentUsageConfig } from './contract/interfaces';
import { User } from '../user/interfaces';
import { PriceWithCurrency } from '../../interfaces';

export const STANDARD_ESTIMATE_TYPE = 'standard';
export const SIMPLE_ESTIMATE_TYPE = 'simple';

export type EstimateType = 'standard' | 'simple';

export interface List<T> {
    totalCount: number;
    items: ReadonlyArray<T>;
}

export interface PriceList {
    id: number;
    allowAddNewPricelistExpendable: boolean;
    expendablesList: List<PriceListItem>;
}

export interface PriceListItem {
    id: number;
    pricelistId: number;
    name: string;
    companyIdentCode: string;
    price: number;
    priceForCompany: number;
}

export interface GetPriceListParams {
    limit: number;
    offset: number;
    name: string;
}

export interface GetDepartmentsListParams {
    limit?: number;
    offset?: number;
    name?: string;
}

export interface Organization {
    id: number;
    name: string;
    brand: string;
    description: string;
    url: string;
    phone: number;
    logoId: number;
    smallLogoId: number;
    isBlocked: boolean;
}

export interface ContactInfo {
    name: string;
    phone: string;
    email: string;
}

export interface DeliveryType {
    value: number;
    name: string;
}

export interface DepartmentList {
    items: Department[];
}

export type Supplier = Suborganization;

export interface SuppliersList {
    items: Supplier[];
    totalCount: number;
}

export interface SuppliersQuery {
    query?: string;
    limit?: number;
    offset?: number;
}

export interface Payment {
    create_date: string;
    details: string;
    id: number;
    invoice_file_id: number | null;
    money_amount: number;
    money_amount_with_currency: PriceWithCurrency | null;
    status: string;
    suborganization_id: number;
}

export interface PaymentListQuery {
    expendable_id?: number;
    limit?: number;
    offset?: number;
    query?: string;
    suborganization_id?: number;
}

export enum PaymentStatuses {
    NORMAL = 'normal',
    NEW = 'new',
    ERROR = 'error',
    IN_PROGRESS = 'in_progress',
    REJECTED = 'rejected',
    DEFERRED = 'deferred',
    CANCELED = 'canceled',
}

export interface Department {
    id: number;
    name: string;
    organizationId: number;
    contacts: ContactInfo;
    commissionForItService: number;
    address: string;
    isBlocked: boolean;
    isDeleted: boolean;
    instruction?: string;
    deliveryType?: number;
    estimateType: EstimateType;
    departmentType?: DeliveryType;
    balanceLimit?: number;
    monthLimit?: number;
    overallBalance?: boolean;
    priceId?: number;
}

export interface Suborganization {
    id: number;
    organizationId: number;
    franchiseId: number;
    name: string;
    officialName: string;
    prefix: string;
    juridicalAddress: string;
    createDate: string;
    isDeleted: boolean;
    autoClose: boolean;
    isBlocked: boolean;
}

export interface GetOrganizationBranchParams extends Pagination {
    organizationUserId: number;
}

export interface Pagination {
    limit?: number;
    offset?: number;
}

export interface Contract {
    items: ReadonlyArray<ContractItem>;
}

export type MaxEstimateCostWithoutApprove = PriceWithCurrency | null;

export interface ContractItem {
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
    incidentUsageConfig: IncidentUsageConfig;
    isBlocked: boolean;
    formatOfClosingDocuments: string[];
    aggregationInClosingDocuments: string[];
    templateOfClosingDocuments: string[];
    additionalReportsAndDocuments: string[];
    edo: string[];
    departments: number[];
}

export interface OrganizationBranch {
    id: number;
    organizationId: number;
    name: number;
    isDeleted: number;
}

export interface OrganizationBranches extends List<OrganizationBranch> {}

export interface List<T> {
    items: ReadonlyArray<T>;
    totalCount: number;
}

export interface Branch {
    id: number;
    organizationId: number;
    name: string;
    isDeleted: boolean;
}

export interface GetOrganizationPriceList {
    departmentId?: number;
    contractId?: number;
    branchId?: number;
    limit?: number;
    offset?: number;
}

export interface OrganizationPriceList {
    items: PriceList_[];
    totalCount: number;
}

export interface PriceList_ {
    id: number;
    name: string;
    userId: number;
    regionCoefficientEnable: boolean;
    paymentTypeCoefficientEnable: boolean;
    expendablesFree: boolean;
    expendablesPayingDepartment: number;
    allowAddNewPricelistExpendable: boolean;
}

export interface GetContractList {
    withIncidentUsage?: boolean;
    isBlocked?: boolean;
    suborganizationId?: number;
    departmentId?: number;
    branchId?: number;
    priceListId?: number;
    ids?: string;
    limit?: number;
    offset?: number;
}

export interface GetPriceCategoryList {
    items: PriceCategoryItem[];
}

export interface PriceCategoryItem {
    id: number;
    parentId: number;
    name: string;
    sla: number;
    priceId: number;
    type: number;
}

export interface TasksReportData {
    createdFrom: string;
    createdTo: string;
    status?: Partial<TaskStatus>;
    organizationUserId?: number;
    suborganizationId?: number;
    departmentId?: number;
}

export interface SalesManagersList {
    items: SalesManager[];
}

export interface SalesManager {
    department: Pick<Department, 'id' | 'name'>;
    salesManagersWithBranches: SalesManagersWithBranches[];
}

export interface SalesManagersWithBranches {
    user: Pick<User, 'id' | 'email' | 'phone'> & { name: string };
    branches: Pick<Branch, 'id' | 'name'>[];
}

export interface CategoryPriceList {
    categoryType: number;
    limit?: number;
    offset?: number;
    query?: string;
}

export interface CreateSupplierPaymentParams {
    details?: string;
    expendable_ids: number[];
    franchise_account_id: number;
    franchise_id: number;
    invoice_file_id?: number;
    is_deferred: boolean;
    supplier_bank_account_id: number;
    supplier_suborganization_id: number;
    vat_rate?: number;
}

export interface SupplierPaymentResponse {
    id: number;
    create_date: string;
    details: string;
    invoice_file_id: number;
    money_amount: number;
    status: string;
    suborganization_id: number;
}

export enum PaymentAction {
    Cancel = 'cancel',
    Process = 'process',
}
