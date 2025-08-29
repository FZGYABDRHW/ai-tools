export interface GetSkillsParams {
    query?: string;
    limit?: number;
    offset?: number;
}

export interface Skill {
    id: number;
    name: string;
    description: string;
}

export interface SkillList {
    items: Skill[];
    totalCount: number;
}
