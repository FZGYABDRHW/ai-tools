export interface Params {
    month?: number;
    year?: number;
    teamId?: number;
    curatorId?: number;
    limit?: number;
    offset?: number;
}

interface CommonStats {
    newTasks: number;
    inWorkTasks: number;
    inWorkOverdueTasks?: number;
    completedTasks: number;
    assignedTasks: number;
    avgTimeClosedIt: number;
    avgTimeClosedMaintenance: number;
    bonus: number;
}

export interface TeamStats extends CommonStats {
    teamId: number;
    teamName: string;
    monthPlan: number;
    planPercentForecast: number;
}

export interface CuratorStats extends CommonStats {
    curatorId: number;
    teamId: number;
    avgTechnicalSupportRating: number;
    estimateRejects: number;
    estimateRejectsPercent: number;
}

export interface TaskStats {
    id: number;
    taskId: number;
    curatorId: number;
    curatorName: string;
    baseBonus: number;
    bonus: number;
    isImportant: boolean;
    isOverdue: boolean;
    performerType: string;
    taskType: number;
    penaltyForTechnicalSupport: number;
    penaltyForAvgTimeClosed: number;
    penaltyForCompletedTasks: number;
}

export enum TaskType {
    UNKNOWN,
    IT,
    MAINTENANCE,
    OTHER,
    CLEANING,
    CASHBOX,
}

export enum PerformerType {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    NEW_WITHOUT_PASSPORT = 'newWithoutPassport',
    NEW_WITH_PASSPORT = 'newWithPassport',
}
