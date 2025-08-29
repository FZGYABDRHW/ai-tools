export enum ResponseName {
    SUCCESS = 'Success',
    ERROR = 'Error',
}

// seems like server always returns code and status 200, so you need to rely on name field
export interface RefuseContractorServerResponse {
    name: string;
    message: string;
    code: number;
    status: number;
}
