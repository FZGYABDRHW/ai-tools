export interface GetSkill {
    requested?: Group[];
    not_requested?: Group[];
    approved?: Group[];
}

export interface Group {
    name: string;
    skills: Skills[];
}

export interface Skills {
    name: string;
    id: number;
    files: number[];
}

export interface SendSkill {
    userId: number;
    toolId: number;
}

export interface Calls {
    userId: number;
}
