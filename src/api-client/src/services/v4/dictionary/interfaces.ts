export enum DictionaryKeyType {
    MEASUREMENT_UNITS = 'measurement_units',
    PERFORMER_TYPES = 'performer_types',
    INCIDENT_REFUSE_REASONS = 'incident_refuse_reasons',
}

export interface Dictionary {
    key: number | string;
    value: string;
}

export interface DictionaryList {
    items: Dictionary[];
    totalCount: number;
}
