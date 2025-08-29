export interface IServerMessage {
    type: number;
    message: string;
    targetField: null | string;
}

export interface IResponseModel<T> {
    response: T;
    status: 0 | 100 | 200 | 401;
    messages: IServerMessage[];
    targetField: string | null;
}
