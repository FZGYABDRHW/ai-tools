export interface IService {
    id: number;
    name: string;
    is_default: boolean;
    description: string;
    owned: ITool;
}

export interface ITool {
    userId: number;
    toolId: number;
}
