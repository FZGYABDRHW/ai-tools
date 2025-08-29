import BaseService from '../../BaseServiceV0';
import { IResponseModel } from '../../interfaces';

export interface ISend {
    userId: number;
    text: string;
}

export class UserActionService extends BaseService {
    private url = `${this.baseUrl}/curator/user/user-action`;

    public readonly performerBlock = (params: ISend) =>
        this.http.post<IResponseModel<null>>(`${this.url}/block`, params).then(res => res.data);

    public readonly performerUnblock = (params: ISend) =>
        this.http.post<IResponseModel<null>>(`${this.url}/unblock`, params).then(res => res.data);
}
