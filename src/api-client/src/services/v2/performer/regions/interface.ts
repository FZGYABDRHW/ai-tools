export interface Response {
    items: Region[];
    totalCount: number;
}

export interface Region {
    id: number;
    name_geocoded: string;
    availableCallTime: {
        from: number;
        to: number;
    };
}
