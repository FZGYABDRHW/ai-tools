import BaseService from '../../../BaseServiceV1';
import { BaseResponse } from '../../../../interfaces';
import { SuitablePerformer, SuitablePerformerModeration } from './interfaces';
import { AxiosRequestConfig } from 'axios';

export class SuitablePerformers extends BaseService {
    private readonly url: string = `${this.baseUrl}/curator/task`;

    async getSuitablePerformersActive(task, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<ReadonlyArray<SuitablePerformer>>>(
            `${this.url}/${task}/suitable-performers/active`,
            options,
        );
        return response;
    }

    async getSuitablePerformersModeration(task, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<SuitablePerformerModeration>>(
            `${this.url}/${task}/suitable-performers/on-moderation`,
            options,
        );
        return response;
    }

    async getSuitablePerformersPassport(task, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<SuitablePerformer>>(
            `${this.url}/${task}/suitable-performers/without-passport`,
            options,
        );
        return response;
    }

    async getSuitablePerformersNotActive(task, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<SuitablePerformer>>(
            `${this.url}/${task}/suitable-performers/inactive`,
            options,
        );
        return response;
    }

    async getSuitablePerformersNotActiveWithoutPass(task, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<SuitablePerformer>>(
            `${this.url}/${task}/suitable-performers/inactive/without-passport`,
            options,
        );
        return response;
    }
}

export default new SuitablePerformers();
