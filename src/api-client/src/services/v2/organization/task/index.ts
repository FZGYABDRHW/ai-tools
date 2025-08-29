import { AxiosRequestConfig } from 'axios';
import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import { Tabs, Task } from './interfaces';

export class OrganizationTaskInfo extends BaseService {
    private url = `${this.baseUrl}/organization/task`;

    async getTabs(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Tabs>>(`${this.url}/tabs`, options);
        return response;
    }

    async getRejectedTasks(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Task>>(`${this.url}/rejected`, options);
        return response;
    }

    async getOnModerationTasks(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Task>>(`${this.url}/on-moderation`, options);
        return response;
    }

    async getInWorkTasks(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Task>>(`${this.url}/in-work`, options);
        return response;
    }

    async getDoneTasks(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Task>>(`${this.url}/done`, options);
        return response;
    }

    async getCanceledTasks(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Task>>(`${this.url}/canceled`, options);
        return response;
    }

    async getAwaitingApproveTasks(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Task>>(`${this.url}/awaiting-approve`, options);
        return response;
    }

    async getOraganizationTasks(id, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Task>>(`${this.url}/${id}`, options);
        return response;
    }

    async getNewTasks(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Task>>(`${this.url}/new`, options);
        return response;
    }
}

export default new OrganizationTaskInfo();
