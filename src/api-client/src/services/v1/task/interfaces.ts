export interface TaskStatuses {
    ON_MODERATION: 1;
    NEW: 2;
    IN_WORK: 3;
    AWAITING_APPROVE: 4;
    DONE: 5;
    CANCELED: 6;
    DRAFT: 7;
    REJECTED: 8;
}

export const taskStatuses: TaskStatuses = {
    ON_MODERATION: 1,
    NEW: 2,
    IN_WORK: 3,
    AWAITING_APPROVE: 4,
    DONE: 5,
    CANCELED: 6,
    DRAFT: 7,
    REJECTED: 8,
};

export interface OrganizationPriceParams {
    departmentId: number;
    shopId: number;
    organizationId: number;
}

export interface TaskQuery {
    creatorId?: number;
    limit: number;
    night: boolean;
    offset: number;
    personal?: boolean;
    query?: string;
    estimateStatus?: string;
    status?: TaskStatuses[keyof TaskStatuses];
    unread: boolean;
    urgent: boolean;
    departmentId?: number;
}

export interface Task {
    id: number;
    name: string;
    description: string;
    departmentId?: number;
    hiddenDescription?: string;
    contactData: {
        name?: string;
        phone?: number;
    };
    timing: {
        create_date: string;
        begin_date?: string;
        inwork_date?: string;
        plan_close_date?: string;
        performer_close_date?: string;
        organization_confirm_date?: string;
        changing_date?: string;
    };
    organization_user_id: number;
    gmt: string;
    status: string;
    commentsCount: number;
    newCommentsCount: number;
    actionExpected: boolean;
    price: number;
    uploadedFiles: File[];
    personal: boolean;
    selectedCategoryId?: number;
    selectedServices: {};
    selectedServicesPrice?: number;
    additionalRequirements?: string[];
    selectedShop: {};
    night: boolean;
    urgent: boolean;
    beginDate: Date;
    closeDate?: Date;
    shop?: null;
    personalUserId?: number;
    organizationAttachments?: Array<File>;
    activeCoefficients?: null;
    departments?: null;
    department?: null;
    departmentCredit?: boolean;
    additionalRequirement?: string;
}

export interface OrganizatonEmployees {
    users: OrganizationEmployee[];
}

export interface OrganizationEmployee {
    departments: ReadonlyArray<OrganizationDepartment>;
    id: number;
    name: string;
    photo_id: number;
}

export interface OrganizationDepartment {
    annotation: string;
    id: number;
    name: string;
    type: {
        id: number;
        name: string;
    };
}

export interface TaskList {
    models: ReadonlyArray<Task>;
    totalModelsCount: number;
}
