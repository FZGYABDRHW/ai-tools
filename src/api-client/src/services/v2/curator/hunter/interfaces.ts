export const TASK_CANCELED_FINE_TYPE = 'taskCanceled';
export const PERFORMER_REFUSED_FINE_TYPE = 'performerRefused';

export interface HunterTotalStats {
    activePerformersBonus: number;
    countActivePerformers: number;
    countInactivePerformers: number;
    countOverTimeHours: number;
    countPerformers: number;
    countRefusedPerformer: number;
    countRefusedUrgentTasks: number;
    countTaskCanceled: number;
    countUrgentTasks: number;
    countWithPassportPerformers: number;
    countWithoutPassportPerformers: number;
    finalBonus: number;
    inactivePerformersBonus: number;
    sumOverTimeFine: number;
    sumRefusedPerformerFine: number;
    sumRefusedUrgentTasksFine: number;
    sumTaskCanceledFine: number;
    totalBonus: number;
    totalFine: number;
    urgentTasksBonus: number;
    withPassportPerformersBonus: number;
    withoutPassportPerformersBonus: number;
}

export interface HunterStats {
    bonus: number;
    hunterId: number;
    isBigCity: boolean;
    overTime: {
        time: number;
        fine: number;
    };
    performer: {
        found: false;
        refused: false;
        type: string;
    };
    searchTime: number;
    task: {
        id: number;
        type: string;
    };
    taskCanceled: {
        canceled: false;
        fine: number;
    };
    citySize: CitySize;
}

export interface AllHunterStats {
    bonus: number;
    calls: {
        number: number;
        duration: number;
        average: number;
    };
    conversion: number;
    foundPerformers: {
        active: number;
        activePercent: number;
        inactive: number;
        taskUrgent: number;
        taskUrgentPercent: number;
        inactivePercent: number;
        newWithPassport: number;
        newWithoutPassport: number;
        newWithoutPassportPercent: number;
        total: number;
    };
    hunterId: number;
    inTimePercent: number;
    newTasks: {
        total: number;
        maintenance: number;
        it: number;
        cleaning: number;
        other: number;
    };
    refusedPerformers: {
        total: number;
        totalPercent: number;
        active: number;
        activePercent: number;
        inactive: number;
        taskUrgent: number;
        taskUrgentPercent: number;
        inactivePercent: number;
        newWithPassport: number;
        newWithPassportPercent: number;
        newWithoutPassport: number;
        newWithoutPassportPercent: number;
    };
    taskCanceledNumber: number;
    teamName: string;
    time: {
        searchTimeAverage: number;
        overTimeTotal: number;
        overTimeAverage: number;
    };
    overTimeAverage: number;
    overTimeTotal: number;
    searchTimeAverage: number;
}

export type FineType = 'taskCanceled' | 'performerRefused';
export type PerformerType =
    | 'inactive'
    | 'active'
    | 'notFound'
    | 'newWithoutPassport'
    | 'newWithPassport'
    | 'searching'
    | 'takenByPerformer';

export interface PerformerFineByType {
    eventFine: number;
    finalFine: number;
    hunterBonusId: number;
    performerTypeFine: number;
}

export interface CitySize {
    size: number;
    sizeName: string;
}

export interface HunterBonusView {
    isBigCity: boolean;
    overTime: number;
    performerType: string;
    recordedAt: string;
    searchTime: number;
    citySize: CitySize;
    task: {
        id: number;
        type: string;
    };
}

export interface CitySizeOvertimeFine {
    citySize: CitySize;
    fine: number;
}

export interface HunterBonusSettings {
    overTimeFineBase: number;
    bigCityOverTimeFine: number;
    performerDismissFine: number;
    citySizeOvertimeFines: CitySizeOvertimeFine[];
}

export interface HunterFines {
    items: ReadonlyArray<PerformerFineByType>;
}

export interface HunterFinesParams {
    hunterId: number;
    type: FineType;
    year: number;
    month: string;
}
