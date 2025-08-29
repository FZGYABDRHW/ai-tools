import { AxiosRequestConfig } from 'axios';
import BaseService from '../BaseServiceV2';
import { BaseResponse } from '../../interfaces';
import { ManagerTask } from './interfaces';

export class ManagerService extends BaseService {
    private url = `${this.baseUrl}/manager`;

    async getApprovalTasks(options?: AxiosRequestConfig) {
        const {
            data: {
                response: { models },
            },
        } = await this.http.get<BaseResponse<{ models: ManagerTask[] }>>(
            `${this.url}/task/approval`,
            options,
        );
        return models;
    }

    async getApprovedTasks(options?: AxiosRequestConfig) {
        const {
            data: {
                response: { models },
            },
        } = await this.http.get<BaseResponse<{ models: ManagerTask[] }>>(
            `${this.url}/task/approved`,
            options,
        );
        return models;
    }

    async getAwaitingDeliveryTasks(options?: AxiosRequestConfig) {
        const {
            data: {
                response: { models },
            },
        } = await this.http.get<BaseResponse<{ models: ManagerTask[] }>>(
            `${this.url}/task/awaiting-delivery`,
            options,
        );
        return models;
    }

    async getDeliveredTasks(options?: AxiosRequestConfig) {
        const {
            data: {
                response: { models },
            },
        } = await this.http.get<BaseResponse<{ models: ManagerTask[] }>>(
            `${this.url}/task/delivered`,
            options,
        );
        return models;
    }

    async getNewTasks(options?: AxiosRequestConfig) {
        const {
            data: {
                response: { models },
            },
        } = await this.http.get<BaseResponse<{ models: ManagerTask[] }>>(
            `${this.url}/task/new`,
            options,
        );
        return models;
    }

    async getNewTasksCount(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<{ count: number }>>(
            `${this.url}/task/count-new`,
            options,
        );
        return response;
    }

    async getDeliveredTasksCount(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<{ count: number }>>(
            `${this.url}/task/count-delivered`,
            options,
        );
        return response;
    }

    async getAwaitingDeliveryTasksCount(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<{ count: number }>>(
            `${this.url}/task/count-awaiting-delivery`,
            options,
        );
        return response;
    }

    async getApprovedTasksCount(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<{ count: number }>>(
            `${this.url}/task/count-approved`,
            options,
        );
        return response;
    }

    async getApprovalTasksCount(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<{ count: number }>>(
            `${this.url}/task/count-approval`,
            options,
        );
        return response;
    }
}

export default new ManagerService();
