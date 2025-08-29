import { ContractorCompany } from '../organization/contractor-company/interfaces';

export enum ExecutionAddressType {
    EXECUTION_ADRESS = 'executionAddress',
    SHOP = 'shop',
}

export enum SortType {
    URGENT = 'isUrgent',
    CREATED = 'createdAt',
    LIMIT_DATE = 'limitDate',
    STATUS = 'status',
    COMMENTS = 'countUnreadComments',
}

export enum OrderType {
    DESC = 'desc',
    ASC = 'asc',
}

export interface IncidentQuery {
    query?: string;
    statuses?: string;
    objectId?: number;
    limit?: number;
    offset?: number;
    organizationId?: number;
    limitStartDate?: string;
    limitEndDate?: string;
    resolvedAtStartDate?: string;
    resolvedAtEndDate?: string;
    responsibleUserId?: number;
    contractorCompanyId?: number;
    hasUnreadComments?: boolean;
    isContractorCompanyAssigned?: boolean;
    isResponsibleUserAssigned?: boolean;
    sort?: SortType;
    order?: OrderType;
}

export interface IncidentList {
    items: Incident[];
    totalCount: number;
}

export interface IncidentListWithAdditionalInfo {
    items: IncidentWithAdditionalInfo[];
    totalCount: number;
}

export interface IncidentListWithEventsCount {
    items: IncidentWithEventsCount[];
    totalCount: number;
}

export interface Incident {
    id: number;
    name: string;
    organizationId: number;
    description: string;
    addressName: string;
    createdAt: string;
    limitDate: string;
    resolvedAt: string;
    status: string;
    equipmentIds: number[];
    incidentCategoryId: number | null;
    executionAddressType: string;
    executionAddressId: number;
    tasks: IncidentTasks[];
    clientIncidentId: string;
    clientLocationId: string;
    number: string;
    step: string;
    branchId: number;
}

export enum TaskStatusStepType {
    FIND_PERFORMER = 'find_performer',
    PERFORMER_APPOINTED = 'performer_appointed',
    IN_WORK = 'in_work',
    AWAITING_APPROVE = 'awaiting_approve',
    DONE = 'done',
}

export interface IncidentTaskStatus {
    taskId: number;
    taskName: string | null;
    taskStep: TaskStatusStepType;
    taskIsAwaitingApprove: boolean;
    estimateIsAwaitingApprove: boolean;
    performerId: number | null;
    performerFullName: string | null;
    performerPhone: string | null;
    performerPhotoId: number | null;
    planArrivalDate: string | null;
}

export interface CreateIncident extends UpdateIncident {
    name: string;
    organizationId: number;
    isUrgent?: boolean;
    executionAddressId: number | null;
    executionAddressType: string | null;
    equipmentIds?: number[];
    incidentCategoryId?: number;
}

export interface UpdateIncident {
    name?: string;
    status?: string;
    address?: string;
    limitDate?: string;
    description?: string;
    clientIncidentId?: string | null;
    number?: string | null;
}

export interface IncidentTasks {
    id: number;
    isApproveAvailable: boolean;
}

export interface EntityIncidentLinkQuery {
    relatedEntityName: string;
    relatedEntityId: number;
}

export interface EntityIncidentLinkList {
    items: EntityIncidentLink[];
}

export interface EntityIncidentLink {
    id: number;
    relatedEntityName: string;
    relatedEntityId: number;
    incidentId: number;
}

export interface IncidentAttachment {
    id: number;
    incidentId: number;
    externalId: string;
    externalFilename: string;
    fileType: number;
    size: number;
    url: string;
    displayName: string;
    fileId: number;
    mime: string;
}

export interface IncidentAttachmentList {
    items: IncidentAttachment[];
    totalCount: number;
}

export interface IncidentEvent {
    id: number;
    incidentId: number;
    externalCommentId: number;
    author: string;
    userId: number;
    text: string;
    externalType: string;
    createdAt: string;
}

export interface IncidentEventsList {
    items: IncidentEvent[];
    totalCount: number;
}

export interface LinkAttachment {
    fileId: number;
    fileType: number;
}

export interface AssignResponsiblePerson {
    user_id: number | null;
}

export interface AssignContractorIncident {
    incident_id: number;
    contractor_company_id: number | null;
}

export interface RefuseIncident {
    refuseReason: string;
}

export interface AssignedContractorCompany {
    id: number;
    name: string;
    email: string;
}

export interface DownloadAttachment {
    attachmentId: number;
    incidentId: number;
    token: string;
}

export interface IncidentCommentariesUnreadCounterInfo {
    count: number;
}

export type IncidentWithAdditionalInfo = Incident & { contractorCompany?: ContractorCompany } & {
    commentariesUnreadCounterInfo?: IncidentCommentariesUnreadCounterInfo;
};

export type IncidentWithEventsCount = Incident & {
    commentariesUnreadCounterInfo?: IncidentCommentariesUnreadCounterInfo;
};

export enum StepIncident {
    INITIAL = 'stepAssignContractorCompany',
    IN_WORK = 'stepInWork',
    DONE = 'stepDone',
}

export interface StepIncidentParams {
    step: StepIncident;
}

export interface PostCommentParams {
    comment: string;
}

export interface EventListParams {
    limit?: number;
    offset?: number;
}

export interface Log {
    id: number;
    text: string;
    createdAt: string;
}

export interface LogsParams {
    limit?: number;
    offset?: number;
}

export interface LogList {
    items: Log[];
    totalCount: number;
}

export enum CategoryType {
    SHOP = 'shop',
    EQUIPMENT = 'equipment',
}

export interface Category {
    id: number;
    created_at: string;
    name: string;
    organization_id: number;
    type: CategoryType;
}

export interface IncidentCategoryList {
    items: Category[];
    totalCount: number;
}

export interface CategoryListParams {
    query?: string;
    organization_id?: number;
    limit?: number;
    offset?: string;
}

export interface CreateCategory {
    name: string;
    organization_id?: number;
}

export interface EditCategory {
    name: string;
    id?: number;
}

export interface CreateRouteParams {
    category_id: number;
    contractor_company_id?: number;
    responsible_user_id?: number;
    shop_ids: number[];
}

export interface GetIncidentRouteListParams {
    category_id?: number;
    shop_id?: number;
    organization_id?: number;
    responsible_user_id?: number;
    contractor_company_id?: number;
    query?: string;
    limit?: number;
    offset?: number;
}

export interface IncidentRouteList {
    items: IncidentRouteListItem[];
    totalCount: number;
}

export interface IncidentRouteListItem {
    id: number;
    category_id: number;
    shop_id: number;
    responsible_user_id: number;
    contractor_company_id: number;
}

export interface IncidentComposedRouteList {
    items: IncidentComposedRouteListItem[];
    totalCount: number;
}

export interface ComposedRouteListItemContractor {
    id: number;
    name: string;
}

export interface IncidentComposedRouteListItem {
    id: number;
    category: ComposedRouteListItemCategory;
    shop: ComposedRouteListItemShop;
    responsible: ComposedRouteListItemResponsible | null;
    contractor: ComposedRouteListItemContractor | null;
}

export interface ComposedRouteListItemCategory {
    id: number;
    name: string;
}

export interface ComposedRouteListItemShop {
    id: number;
    name: string;
    address_name: string;
}

export interface ComposedRouteListItemResponsible {
    id: number;
    name: string;
}

export interface IncidentControls {
    user_can_refuse_incident: boolean;
    user_can_cancel_incident: boolean;
}

export enum RefuseReasons {
    NO_TIME = 'no_time',
    NOT_MY_SPECIALIZATION = 'not_my_specialization',
    NOT_MY_TERRITORY = 'not_my_territory',
    PROBLEM_WITH_CUSTOMER = 'problem_with_customer',
}
