import { TaskCompensationStatus, TaskCompensationType } from './task/interfaces';

export enum ScheduleType {
    DAILY = 'weekDays',
    MONTH_DAYS = 'monthDays',
}

export enum DayPart {
    MORNING = 'morning',
    AFTERNOON = 'afternoon',
    EVENING = 'evening',
    NIGHT = 'night',
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface AllCleanProjects {
    items: ReadonlyArray<Project>;
    totalCount: number;
}

export enum CalendarDayStatus {
    COMPLETE = 'complete',
    INCOMPLETE = 'incomplete',
    AWAIT = 'await',
}

export enum EventType {
    COMMENT = 'comment',
    ANNOTATION = 'annotation',
    LOG = 'log',
}

export interface EventOptions {
    limit?: number;
    offset?: number;
    types?: string;
}

export interface CurrentDate {
    month?: number;
    year?: number;
}

export interface Event {
    id: number;
    userId: number;
    type: EventType;
    text: string;
    createdAt: string;
    deletedAt: string;
    canBeDeleted: boolean;
}

export interface EventResponse {
    items: ReadonlyArray<Event>;
    totalCount: number;
}

export interface CreateEventParams {
    text: string;
    type: EventType;
}

export interface UpdateEventParams {
    text: string;
    type: EventType;
}

export interface RequestCategorySchedule {
    type: ScheduleType;
    onHolidays: boolean;
    startDate: string;
    endDate: string;
    dayPart: DayPart;
    days: Array<number>;
}

export interface CategoryRequest {
    id: number;
    compensation: number;
    compensationPerSquareMeter: number;
    shopIds: Array<number>;
    schedule: RequestCategorySchedule;
}

export type Schedule = RequestCategorySchedule;

export interface Category {
    id: number;
    projectId: number;
    categoryId: number;
    name: string;
    schedule: Schedule;
    description: string;
    compensation: number;
    compensationPerSquareMeter: number;
    selectedShopCount: number;
}

export interface Project extends ProjectCreate {
    id: number;
    autoRenewal: boolean;
    createdUserId: number;
    contractProjectLinks: ContractProjectLinks[];
}

export interface GetProjectParams {
    organizationId?: number;
    offset?: number;
    limit?: number;
    withoutCompleted?: boolean;
}

export interface ContractProjectLinks {
    contractId: number;
    projectId: number;
}

export enum Channels {
    EMAIL = 'email',
}

export interface NotificationChannel {
    channel: Channels;
    isEnabled: boolean;
}

export interface NotificationItems {
    channel: Channels;
    is_enabled: boolean;
    id: number;
}

export interface NotificationChannels {
    items: NotificationItems[];
    totalCount: number;
}

export interface ProjectCreate {
    name: string;
    organizationId: number;
    departmentId: number;
    organizationUserId: number;
    startDate: string;
    endDate: string;
    priceListId: number;
    contractIds: number[];
    description?: string;
    notificationConfigs?: NotificationChannel[];
}

export interface CategoryWithPerformer {
    projectCategoryId: number;
    projectCategoryName: string;
    projectCategoryShortName: string;
    performers: ReadonlyArray<PerformerInfo>;
}

export interface TaskPerformerInfo {
    performers: ReadonlyArray<PerformerInfo>;
    projectCategoryId: number;
    projectCategoryName: string;
    projectCategoryShortName: string;
    shopId: number;
}

export interface PerformerInfo {
    hasManualPerformerPrice: boolean;
    isTemporaryPerformer: boolean;
    userId: number;
}

export interface PerformerPayout {
    completeDayNumber: number;
    totalDayNumber: number;
    categoryOrganizationSum: number;
    categoryPerformerSum: number;
    manualPerformerSum: number;
    compensationSum: number;
    totalOrganizationSum: number;
    totalPerformerSum: number;
}

export interface TaskPayoutInfo {
    projectCategoryId?: number;
    performerId?: number;
    startDate?: string;
    endDate?: string;
    withoutPaidDays?: boolean;
}

export interface List<T> {
    items: ReadonlyArray<T>;
    totalCount: number;
}

export interface GetCalendarPlanParams {
    date: string;
    limit: number;
    offset: number;
    projectCategoryId: number;
}

export interface CalendarPlanDate {
    projectCategory: {
        id: number;
        name: string;
        categoryId: number;
    };
    id: number;
    performerId: number;
    date: string;
    status: CalendarDayStatus;
    performerPrice: number;
    organizationPrice: number;
    paidForPerformer: number;
    incompleteReason: string;
    isTemporaryPerformer: boolean;
    hasManualPerformerPrice: boolean;
}

export interface DetailedForecastBudget {
    budget: number;
    dayMoneyAmount: number;
    days: number;
}

export interface ForecastBudget {
    budget: number;
    days: number;
    details: ReadonlyArray<DetailedForecastBudget>;
    overpayment: number;
}

export interface TaskCategory {
    workedOutDays: {
        total: number;
        worked: number;
    };
    organizationPrice: {
        full: number;
        total: number;
    };
    performerPrice: {
        basePerformerDayPrice: number | null;
        basePerformerMonthPrice: number | null;
        basePerformerPrice: number | null;
        full: number | null;
        forecastBudget: ForecastBudget | null;
        manualBaseDayPriceDiff: number | null;
        manualBaseMonthPriceDiff: number | null;
        manualPerformerDayPrice: number | null;
        manualPerformerMonthPrice: number | null;
        manualPerformerPrice: number | null;
        total: number | null;
    };
    compensationSum: number;
}

export interface Category {
    id: number;
    projectId: number;
    categoryId: number;
    name: string;
    schedule: Schedule;
    description: string;
    compensation: number;
    compensationPerSquareMeter: number;
    shopIds: number[];
    allowDelete: boolean;
    selectedShopCount: number;
    organizationMonthBudget: number;
    performerMonthBudget: number;
}

export interface GetTasksForProjectParams {
    month: number;
    year: number;
    limit?: number;
    shopId?: number;
    offset?: number;
    wordQuery?: string;
    branchId?: number;
    hunterId?: number;
    categoryId?: number;
    needPerformer?: boolean;
}

export interface Categories {
    items: ReadonlyArray<Category>;
    totalCount: number;
}

export interface InventoryRequest {
    name: string;
    amount: number;
    performerId: number;
    projectCategoryId: number;
    purchasePrice: number;
    cashless: boolean;
    paidByCustomer: boolean;
    comment: string;
    deliveryDate: string;
    organizationPrice: number;
    purchaseSum: number;
}

export interface Inventory extends InventoryRequest {
    acceptedUserId: number;
    id: number;
    paid: boolean;
    status: string;
    taskId: number;
    organizationSum: number;
}

export type CategoryListItem = Omit<Category, 'shopIds' | 'selectedShopCount'> & {
    price: {
        performerPrice: number;
        organizationPrice: number;
    };
};

export interface EditProjectParams
    extends Pick<
        CleaningProject,
        | 'id'
        | 'name'
        | 'organizationId'
        | 'departmentId'
        | 'organizationUserId'
        | 'startDate'
        | 'endDate'
        | 'priceListId'
    > {
    contractIds: number[];
}

export interface CleaningProject extends CleaningProjectCreate {
    id: number;
    autoRenewal: boolean;
    createdUserId: number;
}

export interface ProjectCategoryShop {
    projectId: number;
    shopId: number;
    projectCategoryId: number;
}

export interface TaskListParams {
    limit: number;
    offset: number;
    date: string;
}

export interface SuitablePerformerCleaningProject {
    id: number;
    experience: number;
    wasAtObject: boolean;
}

export interface CleaningProjectCreate {
    name: string;
    organizationId: number;
    departmentId: number;
    organizationUserId: number;
    startDate: string;
    endDate: string;
    priceListId: number;
    contractIds: number[];
}

export interface ServiceWithPerformer {
    performerIds: ReadonlyArray<number>;
    projectCategoryId: number;
    projectCategoryName: string;
    projectCategoryShortName: string;
}

export interface TaskExpendableReceipt {
    id: number;
    taskId: number;
    userId: number;
    createdAt: string;
    status: string;
    receiptFn: string;
    receiptFd: string;
    receiptFpd: string;
    jsonText: string;
}

export interface ListServicesWithPerformer {
    items: ReadonlyArray<ServiceWithPerformer>;
    totalCount: number;
}

export interface TaskBudget {
    category: number;
    inventory: number;
    manualPerformerPrice: number;
}

export interface CleaningTask {
    id: number;
    projectId: number;
    contractId: number;
    shopId: number;
    previousTaskId: number;
    startDate: string;
    endDate: string;
    status: string;
    needPerformer: boolean;
    hunterId: number | null;
    createdAt: string;
    performerBudget: TaskBudget & {
        compensation: number;
        compensationPerSquareMeter: number;
    };
    organizationBudget: TaskBudget;
}

export interface ProjectPayout {
    categoryOrganizationSum: number;
    categoryPerformerSum: number;
    manualPerformerPriceSum: number;
    compensationSum: number;
    totalOrganizationSum: number;
    totalPerformerSum: number;
}

export interface DissmissPerformerParams {
    fromDate: string;
    toDate?: string;
    projectCategoryId: number;
}

export interface TaskAttachment {
    displayName: string;
    filename: string;
    id: number;
    isDeleted: number;
    mime: string;
    size: string;
    type: number;
    uploadDate: string;
    url: string;
    userId: number;
}

export interface AssignPerformerParams {
    projectCategoryId: number;
    startDate: string;
    endDate?: string;
    withManualPerformerPrice?: boolean;
    manualPerformerPriceType?: string;
    manualPerformerPrice?: number;
    isTemporaryPerformer?: boolean;
}

export interface ChangeDateParams {
    endDate?: string;
    startDate: string;
}

export interface RegisterPerformerParams {
    phone: string;
    registrationCode: string;
    firstName: string;
    secondName: string;
    birthday: string;
    thirdName?: string;
    passportDate?: string;
    passportSerial?: string;
    passportPodr?: string;
}

export interface TaskCompensationListParams {
    projectCategoryId?: number;
    type?: TaskCompensationType;
    status?: TaskCompensationStatus;
}
