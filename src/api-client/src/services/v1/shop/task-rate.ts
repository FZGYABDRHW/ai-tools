import BaseService from '../BaseServiceV1';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { ITaskInfo, ShopLogin } from './interfaces';

class TaskRateService extends BaseService {
    url: string = `${this.baseUrl}/shop/task`;
    async shopLogin(params: ShopLogin, options?: AxiosRequestConfig) {
        const { data } = await this.http.post<BaseResponse<any>>(
            `${this.baseUrl}/common/shop/login`,
            { ...params },
            options,
        );
        return data.response;
    }

    async getTaskInfo(key: string, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<ITaskInfo>>(`${this.url}/${key}/rate/info`, options);
        return response;
    }

    async setTaskAsNotDone(key: string, comment: string, options?: AxiosRequestConfig) {
        const { data } = await this.http.post<BaseResponse<number>>(
            `${this.url}/${key}/rate/not-done`,
            { comment },
            options,
        );
        return data;
    }

    async setTaskRate(
        key: string,
        politeness: number,
        quality: number,
        options?: AxiosRequestConfig,
    ) {
        const { data } = await this.http.post<BaseResponse<number>>(
            `${this.url}/${key}/rate`,
            { politeness, quality },
            options,
        );
        return data;
    }
}

export { TaskRateService, ITaskInfo };

export default new TaskRateService();
