export interface Suborganization {
    id: number;
    organizationId: number;
    franchiseId: number;
    name: string;
    officialName: string;
    prefix: string | null;
    juridicalAddress: string;
    createDate: string;
    isDeleted: boolean;
    autoClose: boolean;
    isBlocked: boolean;
    description: string | null;
    vatRate: number | null;
}

export interface SuborganizationList {
    items: Suborganization[];
    totalCount: number;
}

export interface ListParams {
    ids?: number[];
    limit?: number;
}

export interface UpdateSuborganization {
    description?: string | null;
    vat_rate?: number | null;
}

export interface Franchise {
    id: number;
    fullName: string;
    franchiseHeadName: string;
    withVat: boolean;
}

export interface LegalIdentifier {
    main: string | null;
    additional: string | null;
}

export interface BankAccount {
    bic: string;
    account_number: string;
}

export interface BankAccountFull extends BankAccount {
    id: number;
}

export enum FranchiseType {
    Wowworks = 1,
    WowworksPlus,
    WowworksRu,
    WowworksUsn,
}
