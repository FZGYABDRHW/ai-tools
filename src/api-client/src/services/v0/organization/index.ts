import BaseService from '../BaseServiceV0';
import { AxiosRequestConfig } from 'axios';
import { RefuseContractorServerResponse } from './interfaces';

export class OrganizationService extends BaseService {
    private readonly url: string = `${this.baseUrl}/organization`;

    getTaskInfo = async (id: number, options?: AxiosRequestConfig) =>
        await this.http
            .get(`${this.url}/task`, { ...options, params: { id } })
            .then(response => response.data);

    refuseContractor = async (taskId: number, options?: AxiosRequestConfig) =>
        await this.http
            .put<RefuseContractorServerResponse>(`${this.url}/task/refuse`, { id: taskId }, options)
            .then(response => response.data);
}
