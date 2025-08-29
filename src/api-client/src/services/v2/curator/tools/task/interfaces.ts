export interface СhangedCurator {
    id: number;
    name: string;
}

export interface Curator {
    id: number;
    name: string;
}

export interface CuratorsList {
    items: Curator[];
    team: string;
}

export interface Hunter {
    id: number;
    name: string;
}

export interface HuntersList {
    items: Hunter[];
    team: string;
}

export interface ChangeCuratorListItems {
    add_date: string;
    curator: string;
    entity_id: null;
    id: number;
    ip: string;
    text: string;
    type: number;
}

export interface ChangedCuratorsList {
    items: ChangeCuratorListItems[];
    totalCount: number;
}

export interface TaskInfo {
    id: number;
    name: string;
    curator_id: number;
    hunter_id: number;
    purchasing_manager_id: number | null;
}
