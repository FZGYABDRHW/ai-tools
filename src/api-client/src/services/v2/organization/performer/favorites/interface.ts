export interface PerformerModel {
    models: Favorites[];
    totalModelsCount: number;
}

export interface Favorites {
    id: number;
    name: string;
    photo: string;
    photoId: number;
}
