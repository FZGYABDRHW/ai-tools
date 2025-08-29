export interface IRegionModel {
    id: number;
    name: string;
    children: {
        id: number;
        name: string;
        owned: boolean;
        hint: string[];
    };
}

export interface ICustomSkillModel {
    id: number;
    name: string;
    description: string;
}

export interface ToolModel {
    description: string;
    id: number;
    name: string;
}

export interface SearchTools {
    items: ToolModel[];
}
