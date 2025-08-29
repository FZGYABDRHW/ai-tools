import { FileFromServer } from '../../interfaces';

export interface FilesResponse {
    files: FileFromServer[];
}

export interface JWTFileManagerParams {
    type: number;
    sessionId: string;
    model?: number;
    locale?: string;
    maxAttachmentsLength?: number;
}
