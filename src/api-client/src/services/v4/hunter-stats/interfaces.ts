export interface HunterTeamStatistics {
    teamId: number;
    teamName: string;
    performersFoundPlan: number;
    performersFoundActual: number;
    performersRefusedPercentPlan: number;
    performersRefusedPercentActual: number;
    performersRefusedCount: number;
    averageSearchTime: number;
}

export interface CleaningTasks {
    all: number;
    daily: number;
    oneTime: number;
}

export interface CancelledCleaningTasks {
    oneTime?: number;
}

export interface HunterStatsCleaning {
    hunterId: number;
    calls: {
        count: number;
    };
    assigned: CleaningTasks;
    onSearching: CleaningTasks;
    found: CleaningTasks;
    dismiss: CleaningTasks;
    cancelled?: CancelledCleaningTasks;
    foundPlan: number;
    bonus: number;
    periodClosed: string;
}

export interface HunterCleaningBonus {
    hunterId: number;
    summary: Summary;
    bonuses: Bonus[];
}

export interface Summary {
    dailyPerformers: number;
    oneTimePerformers: number;
    dailyBonus: number;
    oneTimeBonus: number;
    bonusSum: number;
    oneTimeTaskCancelled?: number;
}

export interface Bonus {
    taskId: number;
    projectId: number;
    performer: string;
    taskType: string;
    bonusType: string;
    bonus: number;
}
