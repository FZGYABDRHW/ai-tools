import BaseService from '../BaseServiceV0';
import { AxiosRequestConfig } from 'axios';

export class PerformerService extends BaseService {
    private readonly url: string = `${this.baseUrl}/performer`;

    getTaskInfo = async (id: number, options?: AxiosRequestConfig) =>
        await this.http
            .get(`${this.url}/task`, { ...options, params: { id } })
            .then(response => response.data);
}
