import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import { ITool } from './interfaces';
import { AxiosRequestConfig } from 'axios';

class PerformerToolsService extends BaseService {
    private url: string = `${this.baseUrl}/performer/settings/tool`;

    getTools = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<ITool[]>>(this.url, options)
            .then(({ data: { response } }) => response);

    removeTool = (toolId: number, options?: AxiosRequestConfig) =>
        this.http
            .delete(this.url, { params: { toolId }, ...options })
            .then(({ data: { response } }) => response);

    requestTool = (toolId: number, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<null>>(this.url, { toolId }, options)
            .then(({ data: { response } }) => response);
}

export { PerformerToolsService };

export default new PerformerToolsService();
