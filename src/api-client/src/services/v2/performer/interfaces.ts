export interface Acts {
    models: ActModel[];
    totalModelsCount: number;
}

export interface ActModel {
    month: number;
    sum: number;
    year: number;
}

export interface ActsParams {
    year: number;
    month: number;
    query: string;
    limit: number;
    offset: number;
}

export interface DownloadParams {
    year: number;
    month: number;
    query?: string;
}

export interface Rating {
    value: number | null;
}
