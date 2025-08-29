export interface PerformerMessage {
    performerId: number;
    type: number;
}

export interface RatingParams {
    limit?: number;
    offset?: number;
}

export interface Rating {
    items: RatingItem[];
    totalCount: number;
}

export interface RatingItem {
    created_at: string;
    deleted_at: string;
    deletingUser: {
        id: number;
        name: string;
    };
    entity_id: number;
    entity_name: string;
    id: number;
    rating: RatingPerformer;
    ratingChange: number;
    ratingTotalDiff: number;
    type: number;
    text: string;
}

export interface RatingPerformer {
    quality: number;
    politeness: number;
    speed: number;
}

export interface RatingAggregated {
    quality: number;
    politeness: number;
    speed: number;
    total: number;
    tasks_count: number;
    better_than: number;
}
