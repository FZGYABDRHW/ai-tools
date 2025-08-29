import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { UserTask } from './interfaces';

export class UserTaskService extends BaseService {
    private readonly url: string = `${this.baseUrl}/user-task`;

    public readonly getCurrentUserTask = (
        relatedEntity: string,
        relatedEntityId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<UserTask>>(
                `${
                    this.url
                }/current?relatedEntity=${relatedEntity}&relatedEntityId=${relatedEntityId}`,
                options,
            )
            .then(response => response.data.response);
}
