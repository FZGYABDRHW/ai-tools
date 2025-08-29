export interface SuitablePerformer {
    id: number;
    name: string;
    photo_id: number;
    phone: number;
    last_entering_date: string;
    registration_date: string;
    tasksDoneCount: number;
    tasksInWorkCount: number;
    alreadyWasOnThisAddress: boolean;
    taskVisited: boolean;
    rating: RatingPerformer;
    notificationStatus: number;
    isSleeping: boolean;
    recentlyEntered: boolean;
}

export interface RatingPerformer {
    total: number;
    quality: number;
    politeness: number;
}

export interface SuitablePerformerModeration {
    id: number;
    name: string;
    photo_id: number;
    phone: number;
    last_entering_date: string;
    registration_date: string;
    taskVisited: boolean;
    isSleeping: boolean;
}
