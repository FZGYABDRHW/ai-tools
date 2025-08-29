export interface Passes {
    isFavorite: boolean;
}

export interface List {
    items: Performer[];
    totalCount: number;
}

export interface Performer {
    name: string;
    photo_id: number;
    tasksInWork: number;
    tasksDone: number;
    rating: number;
    city: string;
}
