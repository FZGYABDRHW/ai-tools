interface SLAParameter {
    paramText: string;
    paramValue: number;
}

export interface Report {
    basePart: {
        average: number;
        quality: number;
        politeness: number;
        speed: number;
    };
    createdAt: string;
    taskId: number;
    slaPart: {
        params: SLAParameter[];
        total: number;
    };
    viewed: boolean;
}
