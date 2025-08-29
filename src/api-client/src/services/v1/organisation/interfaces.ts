import { Task } from '../organization/task/interfaces';

export interface OrganizationPriceParams {
    departmentId: number;
    shopId: number;
    organizationId: number;
}

export interface TaskListParams {
    creatorId: number;
    limit: number;
    night: boolean;
    offset: number;
    personal: boolean;
    query: string;
    estimateStatus?: string;
    status?: number;
    unread: boolean;
    urgent: boolean;
    departmentId?: number;
    branchId?: number;
}

export interface OrganizatonEmployees {
    users: ReadonlyArray<OrganizationEmployee>;
}

export interface OrganizationEmployee {
    departments: ReadonlyArray<OrganizationDepartment>;
    id: number;
    name: string;
    photo_id: number;
    role: {
        type: number;
        name: string;
        description: string;
        ruleName: string;
        data: string;
        createdAt: number;
        updatedAt: number;
    };
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
