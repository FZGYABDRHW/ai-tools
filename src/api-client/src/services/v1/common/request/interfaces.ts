export interface RequestModel {
    models: Request[];
    modelsCount: number;
}

export interface Request {
    id: number;
    user_id: number;
    curator_id: number;
    name: string;
    description: string;
    status: number;
    create_date: string;
    update_date: string;
    curator_visit_date: string;
    user_visit_date: string;
    rating: number;
    guest_id: number;
}

export interface RequestInfo {
    messages: Message[];
    request: Request;
}

export interface Message {
    create_date: string;
    file_id: number;
    id: number;
    is_deleted: boolean;
    request_id: number;
    text: string;
    type: number;
    user_id: number;
}
