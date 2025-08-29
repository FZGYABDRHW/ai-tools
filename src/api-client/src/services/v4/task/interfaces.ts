import { WorkType } from '../estimate/interfaces';
import {
    Personal,
    File,
    Service as ServiceV1,
    Incident,
} from '../../v1/organization/task/interfaces';
import { Shop } from '../../v1/organization/shop/interfaces';
import { PriceWithCurrency } from '../../interfaces';

export interface List<T> {
    items: ReadonlyArray<T>;
    totalCount: number;
}

export enum RefuseReasonType {
    DIFFICULT_TASK = 'difficultTask',
    INCORRECT_TASK_DESCRIPTION = 'incorrectTaskDescription',
    LONG_ESTIMATE_APPROVAL = 'longEstimateApproval',
    TAKEN_BY_MISTAKE = 'takenByMistake',
    UNSATISFACTORY_PRICE = 'unsatisfactoryPrice',
    ANOTHER_REASON = 'anotherReason',
}

export type AdditionalRequirementKey = 'photo_report' | 'act_of_completed_work';

export interface TaskListParams {
    performerId?: number;
    userId?: number;
    limit?: number;
    offset?: number;
    status?: string;
    statuses?: string;
    order?: TaskListOrderType;
    sort?: TaskListSortType;
    query?: string;
}

export interface AdditionalRequirements {
    id?: number;
    name?: string;
    key: AdditionalRequirementKey;
    isValid?: boolean;
}

export interface IPostCommentParams {
    text: string;
    channels?: string | string[];
    recipients?: (number | null)[];
    file_ids?: number[];
}

export interface PerformerRejectParams {
    message?: string;
    refuseReasonType?: RefuseReasonType;
}

export interface TaskAttachment {
    url: string;
    size: string;
    id: number;
    mime: string;
    filename: string;
    display_name: string;
    user_id: number;
    upload_date: string;
    type: number;
    is_deleted: boolean;
}

export interface WorkControls {
    accept: false;
    reject: false;
    update: false;
    delete: false;
    cancel: false;
}

export interface ParamsUpdateTask {
    commissionForItService?: number;
    commissionForItServiceState?: boolean;
    purchasingManagerId?: number;
    beginDate?: string;
}

export enum EventType {
    ANNOTATION = 'annotation',
    COMMENT = 'comment',
    LOG = 'log',
}

export enum VatStrategy {
    COMMON = 'common',
    CONSTRUCTION_WORKS = 'construction_works',
}

export enum TaskStatus {
    ON_MODERATION = 1,
    NEW,
    IN_WORK,
    AWAITING_APPROVE,
    DONE,
    CANCELED,
    DRAFT,
    REJECTED,
    ON_PAYMENT,
    STATUS_AWAITING_SERVICE_APPROVE,
}

export interface Rating {
    speed: number;
    politeness: number;
    quality: number;
}

export interface Price {
    performer: number;
    organization: number;
    organizationTotalPriceVatValue: number;
    organizationTotalPriceWithVat: number;
}

export interface TaskPriceWithCurrency {
    performer?: PriceWithCurrency;
    organization?: PriceWithCurrency;
    organizationTotalPriceVatValue?: number;
    organizationTotalPriceWithVat?: number;
}

export enum TaskProcessType {
    b2c = 'B2C',
    b2b2c = 'B2B2C',
    common = 'common',
    delivery = 'delivery',
}

export enum TaskListType {
    STATUS_ON_MODERATION_NAME = 'onModeration',
    STATUS_ON_PAYMENT_NAME = 'onPayment',
    STATUS_NEW_NAME = 'new',
    STATUS_IN_WORK_NAME = 'inWork',
    STATUS_AWAITING_APPROVE_NAME = 'awaitingApprove',
    STATUS_DONE_NAME = 'done',
    STATUS_CANCELED_NAME = 'canceled',
    STATUS_DRAFT_NAME = 'draft',
    STATUS_REJECTED_NAME = 'rejected',
}

export enum TaskListCleaningType {
    inWork = 'inWork',
    paid = 'paid',
}

export enum TaskListSortType {
    CREATE_DATE = 'createDate',
    ORGANIZATION_CONFIRM_DATE = 'organizationConfirmDate',
}

export enum TaskListOrderType {
    ASC = 'asc',
    DESC = 'desc',
}

export interface Task {
    id: number;
    name: string;
    description: string;
    hiddenDescription: string;
    performerId: number;
    personalUserId?: number;
    organizationId: number;
    suborganizationId: number;
    departmentId: number;
    branchId: number;
    shopId: number;
    hunterId: number;
    curatorId: number;
    type: number;
    isNight: boolean;
    isUrgent: boolean;
    isAltitudeWorkExists: boolean;
    isArriveOnTimeRequired: boolean;
    beginDate: string;
    createDate: string;
    planCloseDate: string;
    organizationConfirmDate: string | null;
    changingDate: string;
    organizationUserId: number;
    performerPlanArrivalDate: string;
    changingDateReason: string;
    status: TaskStatus;
    rating: Rating;
    price: Price;
    priceWithCurrency: TaskPriceWithCurrency;
    processType: TaskProcessType;
    responsiblePerson: ResponsiblePerson;
    contactPerson: ContactPerson;
    purchasingManagerId: number | null;
    executionAddress?: ExecutionAddress;
    timezoneOffset: string;
    withPerformerInvoice?: boolean;
    performerVatRate: number;
    licenseId?: number | null;
    vatStrategy?: VatStrategy;
}

export interface ResponsiblePerson {
    name: string;
    phone: number;
}

export interface ContactPerson {
    name: string;
    phone: number;
}

export interface AddArrivalContactPerson {
    name: string;
    phone: string;
}

export interface GetEventsParams {
    limit: number;
    offset: number;
    types?: EventType | string;
}

export interface Discount {
    amount: number;
    comment: string;
}

export interface WorkPrice {
    total: number;
    base: number;
    totalOld: number;
    price: number;
}

export interface WorkPriceWithCurrency {
    total: PriceWithCurrency;
    base: PriceWithCurrency;
    totalOld: PriceWithCurrency;
    price: PriceWithCurrency;
}

export interface Arrivals {
    items: Arrival[];
    totalCount: number;
}

export enum ContractorArrivalDateStatuses {
    PLANNED = 'planned',
    DONE = 'done',
    FAILED = 'failed',
    MOVED = 'moved',
    CANCELED = 'canceled',
}

export enum ContractorArrivalDateTriggerTypes {
    APP_GPS = 'app_gps',
    PERFORMER_MANUAL = 'performer_manual',
    CURATOR_MANUAL = 'curator_manual',
    SYSTEM = 'system',
}

export interface Arrival {
    id: number;
    createdAt: string;
    taskId: number;
    userId: number;
    status: ContractorArrivalDateStatuses;
    reason: string;
    triggerType: ContractorArrivalDateTriggerTypes;
    planArrivalDate: string;
    arrivalDate: string;
    difference: number;
}

export interface Work {
    additional: boolean;
    amount: number;
    amountOld: number;
    categoryId: number;
    comment: string;
    controls: WorkControls;
    id: number;
    hint: string;
    name: string;
    order: number;
    prices: {
        performer: WorkPrice;
        organization: WorkPrice;
    };
    pricesWithCurrency: {
        performer: WorkPriceWithCurrency;
        organization: WorkPriceWithCurrency;
    };
    type: WorkType;
    requestDate: string;
    skills: Array<string>;
    status: {
        alias: string;
        message: string;
    };
    subStatus: number;
    userId: number;
}

export interface UnassignParams {
    reportType?: number;
    dispatchExpected?: boolean;
    saveExpendables: boolean;
}

export interface SuitablePerformers {
    items: Array<SuitablePerformer>;
    totalCount: number;
}

export interface SuitablePerformer {
    id: number;
    photoId: number;
    firstName: string;
    secondName: string;
    thirdName: string;
    lastEnteringDate: string;
    phone?: number;
    email?: string;
    primaryRole?: string;
    isSleeping?: string;
}

export enum EventChannels {
    EMAIL = 'email',
}

export interface Event {
    id: number;
    userId: number;
    taskId: number;
    text: string;
    type: EventType;
    addDate: string;
    isDeleted?: boolean;
    channels?: string[];
    recipients?: number[] | null;
}

export interface EventAttachment {
    id: number;
    mime: string;
    size: number;
    upload_date: string;
    display_name: string;
    type: number;
}

export interface EventAttachmentsList {
    items: EventAttachment[];
    totalCount: number;
}

export interface PostedEvent {
    id: number;
    taskId: number;
    text: string;
    userId: number;
}

export interface UpdateArrivalParams {
    action: ArrivalActions;
    reason?: string;
    newDate?: string;
}

export enum ArrivalActions {
    ARRIVE = 'arrive',
    CANCEL = 'cancel',
    MOVE = 'move',
}

export interface WorkTotalPrice {
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

export type NotificationsStatus =
    | 'disabled'
    | 'not_send'
    | 'unknown'
    | 'in_queue'
    | 'delivered'
    | 'failed'
    | 'telegram'
    | 'application_push';

export interface PerformerInfoAboutTask {
    alreadyWasOnThisAddress: boolean;
    alreadyWasOnThisShop: boolean;
    taskVisited: boolean;
    notificationStatus: NotificationsStatus;
    specializations: {
        requested: ReadonlyArray<string>;
        notRequested: ReadonlyArray<string>;
    };
}

export interface Coordinate {
    lat: number;
    lon: number;
}

export interface Polygon {
    id: number;
}

export interface Address {
    name: string;
    apartment: string;
    floor: string;
    entrance: string;
    address: string;
    addressPoint: Coordinate;
    polygon?: Polygon;
}

export interface ExecutionAddress {
    address: Address;
    fullName: string;
    phones: Array<string>;
    deliveryDate?: Date;
    id?: number;
}

interface Service {
    id: number;
    comment: string;
    amount: number;
    incidents: { id: number }[];
}

export interface UpdateTaskContract {
    contractId: number;
    departmentId: number;
    branchId: number;
}

export interface B2B2CFormParams {
    executionAddress: Pick<ExecutionAddress, 'address' | 'fullName' | 'phones' | 'deliveryDate'>;
    selectedServices: Array<Service>;
    departmentId: number;
    suborganizationId: number;
    personalId: number;
}

export interface DeliveryFormParams extends B2B2CFormParams {
    description: string;
    hiddenDescription: string;
}

export interface CommonTaskParams {
    name: string;
    description?: string;
    departmentId: number;
    hiddenDescription?: string;
    contactData: { name?: string; phone?: number };
    uploadedFiles: File[];
    personal?: Personal;
    selectedServices: ServiceV1[];
    selectedShop: Partial<Shop>;
    night: boolean;
    urgent: boolean;
    withAltitudeWork: boolean;
    isArriveOnTimeRequired?: boolean;
    beginDate: string;
    closeDate?: string;
    incidents?: Incident[];
    maxEstimateCostWithoutApprove?: number | null;
}

export interface TaskRating {
    id: number;
    taskId: number;
    type: string;
    ratingQuality: number;
    ratingPoliteness: number;
    comment: string;
    isNotDone: boolean;
    createdAt: string;
}

export interface AssignPerformerToTaskData {
    comment: string;
}

export interface PerformerAttachmentsQuery {
    limit?: number;
    offset?: number;
    type?: number;
}

export interface CalculatePlanCloseDateParams {
    beginDate: string;
    categories: CategoriesParam[];
    shopId?: number;
    isUrgent?: boolean;
    isNight?: boolean;
}

export interface CategoriesParam {
    id: number;
    amount: number;
}

export enum InvoiceStatuses {
    MODERATE = 'onCuratorModeration',
    APPROVED = 'approved',
}

export interface PerformerInvoice {
    id: number;
    task_id: number;
    performer_id: number;
    number: string;
    date: string;
    sum: number;
    vat_sum: number;
    status: InvoiceStatuses;
    paid_sum: number;
    paid_sum_vat: number;
    comment: string;
    created_at: string;
}

export enum PerformerInvoiceTargetFields {
    NUMBER = 'number',
    DATE = 'date',
    SUM = 'paidSumWithoutVAT',
    FILE_IDS = 'file_ids',
}

export interface CreatePerformerInvoicePayload {
    number: string;
    date: string;
    sum: number;
    file_ids: number[];
}

export interface ApprovePerformerInvoicePayload {
    number: string;
    date: string;
    sum: number;
    file_ids: number[];
    paid_sum?: number | null;
    paid_sum_vat?: number;
    comment?: string;
}

export interface EditPerformerInvoicePayload {
    number?: string;
    date?: string;
    sum?: number;
    file_ids?: number[];
    paid_sum?: number;
    comment?: string;
}

export interface SetVatStrategyParams {
    vat_strategy: VatStrategy;
}

export interface Controls {
    organization: {
        estimate: {
            isUserCanRejectEstimate: boolean;
            isUserCanApproveEstimate: boolean;
        };
        task: {
            isUserCanPublishTask: boolean;
            isUserCanCancelTask: boolean;
            isUserCanRejectTask: boolean;
            isUserCanConfirmTask: boolean;
            isUserCanPostComment: boolean;
            isUserCanRefuseTaskPerformer: boolean;
        };
    };
    curator: {
        estimate: {
            isUserCanEstimateDownload: boolean;
            isUserCanCreateCashlessExpendable: boolean;
        };
        task: {
            isUserCanChangeCurator: boolean;
            isUserCanChangeHunter: boolean;
            isUserCanCancelTask: boolean;
            isUserCanChangePurchasingManager: boolean;
            isUserCanChangeCommissionForItServiceState: boolean;
            isUserCanSendNotification: boolean;
            isUserCanIncreasePriority: boolean;
            isUserCanSwitchAltitudeWorkTask: boolean;
            isUserCanSwitchNightTask: boolean;
            isUserCanSwitchUrgentTask: boolean;
            isUserCanSwitchNeedPhotoReport: boolean;
            isUserCanSwitchNeedActOfCompletedWork: boolean;
            isUserCanExpendablesCashless: boolean;
            isUserCanDownloadAllFilesTask: boolean;
            isUserCanChangeTaskContract: boolean;
            isUserCanChangePerformerArrivals: boolean;
            isUserCanPostComment: boolean;
            isUserCanApprovePerformerTaskInvoice: boolean;
            isUserCanCreatePerformerTaskInvoice: boolean;
            isUserCanEnableTaskConstructionWorks: boolean;
            isUserCanDisableTaskConstructionWorksd: boolean;
            isUserCanDeleteTaskConstructionWorkLicense: boolean;
            isUserCanCreateConstructionWorkLicense: boolean;
            isUserCanManuallyNotifyPerformersAboutNewTask: boolean;
            isUserCanEnableArriveOnTimeRequirement: boolean;
            isUserCanDisableArriveOnTimeRequirement: boolean;
            isUserCanUnassignTaskPerformer: boolean;
        };
    };
    performer: {
        estimate: {
            isUserCanReturnEstimateToWork: boolean;
            isUserCanSendEstimateToCuratorModeration: boolean;
        };
        task: {
            isUserCanTakeTask: boolean;
            isUserCanMarkTaskAsCompleted: boolean;
            isUserCanReturnTaskInWork: boolean;
            isUserCanAddTaskArrival: boolean;
            isUserCanSetPerformerTaskArrive: boolean;
            isUserCanCancelTaskArrival: boolean;
            isUserCanMoveTaskArrival: boolean;
            isUserCanPostComment: boolean;
            isUserCanCreatePerformerTaskInvoice: boolean;
            isUserCanEnableTaskConstructionWorks: boolean;
            isUserCanDisableTaskConstructionWorks: boolean;
            isUserCanCreateConstructionWorkLicense: boolean;
        };
    };
}

export interface ExtraFields {
    license_id: number;
    vat_strategy: VatStrategy;
    performer_vat_rate: number;
    with_performer_invoice: boolean;
    is_altitude_work_exists: boolean;
    max_estimate_customer_cost_without_approve: PriceWithCurrency | null;
    max_estimate_contractor_cost_without_approve: PriceWithCurrency | null;
}

export interface CancelReasons {
    value: number;
    label: string;
}

export interface CancelReason {
    key: number;
    value: string;
}
