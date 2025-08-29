export interface EditedFile {
    file: {
        display_name: string;
        filename: string;
        id: number;
        is_deleted: number;
        mime: string;
        size: string;
        type: number;
        upload_date: string;
        url: string;
        user_id: number;
    };
}

export interface IServerMessage {
    type: number;
    message: string;
    targetField: null | string;
}

export interface File {
    id: number;
    mime: string;
    url: string;
    displayName: string;
    size: string;
}
