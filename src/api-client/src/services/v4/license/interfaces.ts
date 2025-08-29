import { FileFromServer } from '../../interfaces';

export enum ServiceType {
    CONSTRUCTION = 'construction',
}

export enum RelatedEntityName {
    USER = 'user',
}

export interface License {
    id: number;
    service_type: ServiceType;
    valid_until: string;
    related_entity_name: RelatedEntityName;
    related_entity_id: number;
}

export interface GetListParams {
    user_id?: number;
    service_type?: ServiceType;
}

export interface CreateParams {
    file_ids: number[];
    valid_until: string;
}

export interface GetListResponse {
    items: License[];
    totalCount: number;
}

export interface CreateResponse {
    id: number;
}

export interface GetFilesResponse {
    items: FileFromServer[];
    totalCount: number;
}
