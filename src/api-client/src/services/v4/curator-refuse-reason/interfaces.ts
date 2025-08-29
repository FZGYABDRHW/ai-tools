export interface RefuseReason {
    id: number;
    userId: number;
    type: number;
    date: string;
    reason: string;
}

export enum RefuseReasonType {
    INDIVIDUAL_ENTREPRENEUR = 1,
    IDENTITY_DOCUMENT,
}
