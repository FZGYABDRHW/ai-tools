import { Omit } from '../../cleaning/interfaces';

export interface InviteParams {
    organizationId: number;
    email: string;
}

export interface BaseListParams {
    limit?: number;
    offset?: number;
}

export enum ContractorCompanyWorkflow {
    Task = 'task',
    Common = 'common',
}

export interface ContractorCompany {
    id: string | number;
    status?: string;
    name?: string;
    email: string | null;
    is_required: boolean;
    workflow: ContractorCompanyWorkflow;
}

export interface ContractorCompanyList {
    items: Registered[];
    totalCount: number;
}

export interface Registered {
    id: number;
    name: string;
    email: string;
    status?: string;
}

export interface RegisteredListParams extends BaseListParams {
    name?: string;
    query?: string;
}

export interface Invited {
    id: string;
    status: string;
    email: string;
}

export type ComposedContractorCompany = Omit<ContractorCompany, 'is_required' | 'workflow'>;
