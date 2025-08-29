import { BaseResponse } from '../../../../interfaces';
import BaseService from '../../../BaseServiceV1';
import { AxiosRequestConfig } from 'axios';
import { Passes, List } from './interfaces';

export class PerformersPasses extends BaseService {
    private url = `${this.baseUrl}/organization/performer`;

    async getListWithoutPasses(
        offset: number = 0,
        limit: number = 10,
        options?: AxiosRequestConfig,
    ) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<List>>(`${this.url}/pass/list/without`, {
            params: {
                limit,
                offset,
            },
            ...options,
        });
        return response;
    }

    async getListWithPasses(offset: number = 0, limit: number = 10, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<List>>(`${this.url}/pass/list/with`, {
            params: {
                limit,
                offset,
            },
            ...options,
        });
        return response;
    }

    async addPass(performerID, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.post<BaseResponse<Passes>>(
            `${this.url}/${performerID}/pass`,
            {},
            options,
        );
        return response;
    }

    async deletePass(performerID, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.delete(`${this.url}/${performerID}/pass`, options);
        return response;
    }
}

export default new PerformersPasses();
