import { AxiosRequestConfig } from 'axios';

import { BaseResponse } from '../../../interfaces';
import BaseService from '../../BaseServiceV1';
import { PreActConfirmation } from './confirmation-act/interfaces';
import {
    Requirement,
    Response,
    MessageConfirm,
    TaskInfo,
    ParamsRatingTask,
    Price,
} from './interfaces';

export class OrganizationTask extends BaseService {
    private readonly url: string = `${this.baseUrl}/organization/task`;

    async getRequirements(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Response>>(
            `${this.url}/additional/requirement`,
            options,
        );
        return response;
    }
    async getTaskInfo(taskId: number, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<TaskInfo>>(`${this.url}/${taskId}/rate/info`, options);
        return response;
    }

    async confirmRatingTask(
        taskId: number,
        params: ParamsRatingTask,
        options?: AxiosRequestConfig,
    ) {
        const {
            data: { messages },
        } = await this.http.post<BaseResponse<MessageConfirm>>(
            `${this.url}/${taskId}/confirm`,
            params,
            options,
        );
        return messages;
    }

    async updateRating(taskId: number, params: ParamsRatingTask, options?: AxiosRequestConfig) {
        const {
            data: { messages },
        } = await this.http.put<BaseResponse<MessageConfirm>>(
            `${this.url}/${taskId}/rating`,
            { params },
            options,
        );
        return messages;
    }

    async getPrice(params: { departmentId: number; shopId: number }, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Price>>(`${this.baseUrl}/organisation/price`, {
            params,
            ...options,
        });
        return response;
    }

    getConfirmationAct(taskId: number, options?: AxiosRequestConfig) {
        return this.http
            .get<BaseResponse<PreActConfirmation>>(
                `${this.url}/${taskId}/confirmation-act`,
                options,
            )
            .then(response => response.data.response);
    }
}

export default new OrganizationTask();
