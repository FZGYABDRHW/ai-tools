export interface TransportCompanies {
    transportCompaniesList: TransportCompany[];
}

export interface TransportCompany {
    name: string;
    code: string;
}

export interface Tracker {
    tracker: string;
    delivered: boolean;
    data: TrackingStatus;
}

export interface TrackingStatus {
    operation: string;
    location: string;
}
