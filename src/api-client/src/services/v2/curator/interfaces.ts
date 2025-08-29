export interface SessionStatus {
    canReceiveTask: boolean;
    isBusy: boolean;
    isDuty: boolean;
}

export interface Shops {
    objectId: number;
    brand: string;
    address: string;
    searchStatus: boolean;
    distance: number;
    contractors?: ContractorList[];
}

export interface ContractorList {
    id: number;
    name: string;
    lastWorkingDate: string;
}

export interface List<T> {
    items: ReadonlyArray<T>;
    totalCount: number;
}
