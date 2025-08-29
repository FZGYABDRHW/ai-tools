import BaseService from '../BaseServiceCurator';
import { AxiosRequestConfig } from 'axios';
import { SendAnnotationQuery } from './interface';
import { BaseResponse } from '../../interfaces';

export class CuratorTaskService extends BaseService {
    private readonly url: string = `${this.baseUrl}/task`;

    readonly getTaskInfo = async (id: number, options?: AxiosRequestConfig) =>
        await this.http
            .get(`${this.url}`, { params: { id }, ...options })
            .then(response => response.data);

    readonly sendAnnotation = async (data: SendAnnotationQuery, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<void>>(`${this.url}/task/annotation`, data, options)
            .then(resp => resp.data.response);
}
