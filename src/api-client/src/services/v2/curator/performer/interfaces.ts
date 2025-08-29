export interface Status {
    id: number;
}

export interface StatusPay {
    moneybackAvailable: boolean;
    status: string;
}

export interface ChangeLocation {
    userId: number;
    regionId: number;
    type?: RegionType;
}

export const enum RegionType {
    MAIN = 1,
    ADDITIONAL,
    MISC,
}
