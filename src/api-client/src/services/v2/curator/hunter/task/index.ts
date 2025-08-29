import BaseService from '../../../BaseServiceV2';
import { BaseResponse } from '../../../../interfaces';
import { HunterSearchTaskInfo, TaskInfoParams } from './interfaces';
import { AxiosRequestConfig } from 'axios';

export class HunterTaskInfo extends BaseService {
    private readonly url = `${this.baseUrl}/curator/hunter/task`;

    public readonly getHunterSearchTaskInfo = (
        taskId: number,
        params?: TaskInfoParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<HunterSearchTaskInfo>>(`${this.url}/${taskId}/search-info`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);
}

export default new HunterTaskInfo();
