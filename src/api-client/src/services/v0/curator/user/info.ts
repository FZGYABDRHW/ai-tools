import BaseService from '../../BaseServiceV0';
import { Performer, PostAnnotation } from './interfaces';

export class PerformerInfo extends BaseService {
    private url = `${this.baseUrl}/curator/user`;

    public readonly getPerformerInfo = (performerId: number) =>
        this.http
            .get<Performer>(`${this.url}/profile/summary?userId=${performerId}`)
            .then(res => res.data);

    public readonly postAnnotations = (params: { userId: number; text: string }) =>
        this.http
            .post<PostAnnotation>(`${this.url}/user-action/annotation`, params)
            .then(res => res.data);
}
