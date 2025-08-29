import { EstimateType } from '../organization/interfaces';
import { PriceWithCurrency, CurrencyCodes, FileFromServer } from '../../interfaces';

export enum EstimateEventType {
    ESTIMATE_COMMENT_EVENT_TYPE = 'estimate_comment',
    ESTIMATE_ANNOTATION_EVENT_TYPE = 'estimate_annotation',
    ESTIMATE_LOG_EVENT_TYPE = 'log',
}

export enum EstimateStatus {
    PRIMARY_ESTIMATE_STATUS = 'primary',
    REJECTED_ESTIMATE_STATUS = 'rejected',
    ON_CURATOR_MODERATION_ESTIMATE_STATUS = 'on_curator_moderation',
    ON_CUSTOMER_APPROVAL_ESTIMATE_STATUS = 'on_customer_approval',
    ON_PURCHASE_MODERATION_ESTIMATE_STATUS = 'on_purchase_moderation',
    APPROVED_ESTIMATE_STATUS = 'approved',
    IN_WORK_ESTIMATE_STATUS = 'in_work',
    DONE_ESTIMATE_STATUS = 'done',
    CANCELED_ESTIMATE_STATUS = 'canceled',
}

export enum WorkType {
    DEFAULT = 1,
    HIDDEN,
}

export enum ExpendableType {
    DEFAULT = 1,
    HIDDEN,
    ADHERENT,
}

export enum EstimateAction {
    ACCEPT_ACTION = 'accept',
    CREATE_ACTION = 'create',
    REJECT_ACTION = 'reject',
    UPDATE_ACTION = 'update',
    DELETE_ACTION = 'delete',
    CANCEL_ACTION = 'cancel',
    UPDATE_PRICE_ORGANIZATION_ACTION = 'updatePriceOrganization',
    PAID_BY_WOWWORKS_ACTION = 'paidByWowworks',
    PAID_BY_CUSTOMER_ACTION = 'paidByCustomer',
}

export enum TaskType {
    NIGHT = 7,
    URGENT,
    ALTITUDE_WORK,
    ARRIVE_ON_TIME,
}

export enum WorkStatus {
    ACCEPTED_WORK_STATUS = 'accepted',
    APPROVED_WORK_STATUS = 'approved',
    REQUESTED_WORK_STATUS = 'requested',
    REJECTED_WORK_STATUS = 'rejected',
}

export enum ExpendableStatus {
    REQUESTED,
    ACCEPTED,
    REJECTED,
    DELETED,
    DELETE_REQUESTED,
    EDIT_REQUESTED,
    APPROVED,
    AWAITING_DELIVERY,
    DELIVERED,
}

export enum ETADetailsConstants {
    ETA = 'eta',
    ARRIVAL_TIME = 'arrivalTime',
    EXPENDABLES_TIME = 'expendablesTime',
    PASS_TIME = 'passTime',
    EDIT_ESTIMATE_TIME = 'editEstimateTime',
}

export const EXPENDABLES_DELIVERY = 10115;
export const DEFAULT_EXPENDABLES_LIMIT = 100;
export const DEFAULT_WORKS_LIMIT = 100;

export type PostCommentParams = {
    type: EventType;
    text: string;
};

export type EventType = 'estimate_comment' | 'estimate_annotation' | 'log';

export type Action =
    | 'accept'
    | 'create'
    | 'reject'
    | 'update'
    | 'delete'
    | 'cancel'
    | 'updatePriceOrganization'
    | 'paidByCustomer'
    | 'paidByWowworks';

export type AdditionalTaskType = 7 | 8;

export interface GetCommentsParams {
    limit: number;
    offset: number;
    version?: number;
    types?: Array<EventType>;
}

export interface ExpendablesParams {
    estimateTaskWorkId: number;
    version?: number;
    limit?: number;
    offset?: number;
}

export interface EtaDateTime {
    date: string;
    timezone: string;
    timezone_type: number;
}

export interface Estimate {
    createdAt: string;
    curatorId: number;
    customerId: number;
    eta: number;
    id: number;
    etaDateTime: EtaDateTime;
    supposedEtaDateTime: string;
    isEdited: boolean;
    performerId: number;
    status: EstimateStatus;
    taskId: number;
    type: EstimateType;
    updatedAt: string;
    version: number;
    currency: CurrencyCodes;
}

export interface WorkItem {
    amount: number;
    amountOld: number;
    categoryId: number;
    comment: string;
    controls: {
        accept: boolean;
        reject: boolean;
        update: boolean;
        delete: boolean;
        cancel: boolean;
        updatePriceOrganization: boolean;
        paidByCustomer: boolean;
        paidByWowworks: boolean;
    };
    hint: string;
    id: number;
    isAdditionalType: boolean;
    name: string;
    prices: {
        organization: Partial<Price>;
        performer: Partial<Price>;
    };
    pricesWithCurrency: {
        organization: Partial<WorkItemPriceWithCurrency>;
        performer: Partial<WorkItemPriceWithCurrency>;
    };
    order: number;
    requestDate: string;
    skills: Array<string>;
    status: {
        alias: string;
        message: string;
    };
    unit: string;
    subStatus: number;
    timeToComplete?: number;
    userId: number;
}

export interface WorkListParams {
    version?: number;
    limit?: number;
    offset?: number;
}

export interface Price {
    base: number;
    price: number;
    total: number;
    totalOld: number;
}

export interface WorkItemPriceWithCurrency {
    base: PriceWithCurrency;
    price: PriceWithCurrency;
    total: PriceWithCurrency;
    totalOld: PriceWithCurrency;
}

export interface AmountPrice {
    current: number;
    previous: number;
}

export interface AmountPriceWithCurrency {
    current: PriceWithCurrency;
    previous: PriceWithCurrency;
}

export interface ExpendableState {
    message: string;
    status: number;
    alias: string;
}

export interface ExpendableControls {
    accept: boolean;
    reject: boolean;
    update: boolean;
    delete: boolean;
    cancel: boolean;
    paidByCustomer: boolean;
    paidByWowworks: boolean;
}

export interface ExpendableItem {
    amount: AmountPrice;
    canMakeCashless: boolean;
    cashless: boolean;
    controls: ExpendableControls;
    default: boolean;
    description: string;
    id: number;
    name: string;
    type: ExpendableType;
    price: AmountPrice;
    purchasePrice: number;
    state: ExpendableState;
    subStatus: number;
    totalPrice: AmountPrice;
    invoiceFile: ExpendableFile;
    deliveryDate?: string;
    deliveryInvoice?: string | null;
    deliveryPlaceAddress?: string | null;
    deliveryPlaceType?: DeliveryPlace;
    estimateTaskWorkId: number;
    priceListExpendableId?: number;
    priceWithCurrency: AmountPriceWithCurrency;
    totalPriceWithCurrency: AmountPriceWithCurrency;
    priceForCompanyWithCurrency: AmountPriceWithCurrency;
}

export interface ExpendableFile {
    id: number;
    mime: string;
    url: string;
    display_name: string;
    size: number;
    upload_date: string;
    is_viewed_by_user: boolean;
}

export interface ExpendableInfo {
    id: number;
    taskId: number;
    name: string;
    description: string;
    default: boolean;
    cashless: boolean;
    amount: AmountPrice;
    price: AmountPrice;
    totalPrice: AmountPrice;
    state: ExpendableState;
    controls: ExpendableControls;
    deliveryDate?: string;
    deliveryPlaceType?: DeliveryPlace;
    deliveryPlaceAddress?: string;
    deliveryInvoice?: string;
    invoiceFile: FileFromServer;
    priceListExpendableId?: number;
}

export interface TotalPrices {
    organization: TotalPrice;
    performer: TotalPrice;
}

export interface TotalPrice {
    priceWithCurrency: {
        rejected: PriceWithCurrency;
        requested: PriceWithCurrency;
        total: PriceWithCurrency;
    };
    rejected: number;
    requested: number;
    total: number;
}

export enum UpdateWorkActions {
    CANCEL = 'cancel',
    DELETE = 'delete',
    UPDATE = 'update',
}

export interface UpdateWorkParams {
    action: UpdateWorkActions;
    amount?: number;
    subStatus?: number;
    comment?: string;
    type?: WorkType;
    priceOrganization?: number;
    timeToComplete?: number;
}

export enum UpdateExpendableActions {
    UPDATE = 'update',
    ACCEPT = 'accept',
    DELETE = 'delete',
    CANCEL = 'cancel',
}

export interface UpdateExpendable {
    action: UpdateExpendableActions;
    silent?: boolean;
    subStatus?: number;
    price?: number;
    priceWithCurrency?: PriceWithCurrency;
    amount?: number;
    description?: string;
    name?: string;
    type?: ExpendableType;
    purchasePrice?: number;
    makeCashless?: boolean;
    deliveryDate?: string | null;
    priceListExpendableId?: number | null;
    deliveryPlaceType?: DeliveryPlace | null;
    deliveryPlaceAddress?: string | null;
    deliveryInvoice?: string | null;
}

export interface EstimateEvent {
    createdAt: string;
    estimateId: number;
    estimateVersion: number;
    id: number;
    isDeleted: boolean;
    text: string;
    type: string;
    userId: number;
}

export interface EstimateEvents {
    items: Array<EstimateEvent>;
    totalCount: number;
}

export interface EstimateVersions {
    items: Array<EstimateVersion>;
    totalCount: number;
}

export const DELIVERY_PLACE_SHOP = 'delivery_place_shop';
export const DELIVERY_PLACE_POINT = 'delivery_place_point';

export type DeliveryPlace = 'delivery_place_shop' | 'delivery_place_point';

export interface NewExpendable {
    name: string;
    amount: number;
    description: string;
    price: number;
    cashless?: boolean;
    estimateTaskWorkId?: number;
    purchasePrice?: number;
    deliveryDate?: string;
    deliveryPlace?: DeliveryPlace;
    deliveryPlaceAddress?: string;
    deliveryInvoice?: string;
    priceListExpendableId?: number | null;
}

export interface EstimateVersion {
    createdAt: string;
    estimateVersion: number;
    id: number;
}

export type UrgentType = 8;
export type NightType = 7;
export type ArriveOnTomeType = 10;
export type AltitudeWorkType = 9;

export interface AdditionalWork {
    organization: Array<Service>;
    performer: Array<Service>;
    works: AdditionalWorkItems;
}

export interface AdditionalWorkItems {
    urgent: AdditionalWorkItem;
    night: AdditionalWorkItem;
    altitudeWork: AdditionalWorkItem;
    arriveOnTime: AdditionalWorkItem;
}

export interface AdditionalWorkItem {
    id: number;
    type: number;
    amount: number;
    performerPrice: PriceWithCurrency;
    totalPerformerSum: PriceWithCurrency;
    controls: Controls;
}

export interface Controls {
    paidByCustomer: boolean;
    paidByWowworks: boolean;
    update: boolean;
}

export interface Service {
    childs: Child[];
    description: string;
    has_subcategories: boolean;
    id: number;
    img_id: number;
    type: UrgentType | NightType | ArriveOnTomeType | AdditionalTaskType;
    img_url: string;
    name: string;
    not_blocking: boolean;
    parent_id: number;
    price: number;
    priceWithCurrency: PriceWithCurrency;
    root: number;
    sla: number;
    without_allowance: boolean;
}

export interface Child {
    description: string;
    id: number;
    name: string;
    not_blocking: boolean;
    parent_id: number;
    price: number;
    priceWithCurrency?: PriceWithCurrency;
    root: number;
    sla: number;
    without_allowance: boolean;
}

export interface EstimateLog {
    createdAt: string;
    info: string;
    title: string;
    type: string;
}

export interface TransportCompanies {
    items: ReadonlyArray<TransportCompany>;
    totalCount: number;
}

export interface TransportCompany {
    id: number;
    name: string;
}

export interface RequestWork {
    name?: string;
    comment?: string;
    pricePerformer?: number;
    priceOrganization?: number;
    amount: number;
    timeToComplete?: number;
    categoryId?: number;
    standard?: boolean;
    unit?: number;
    skillId?: number;
}

export interface ETA {
    totalTime: number;
    details: ETADetails;
}

export type ETADetails = { [K in ETADetailsConstants]: number | null };
