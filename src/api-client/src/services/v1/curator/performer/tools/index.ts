import BaseService from '../../../BaseServiceV1';
import { BaseResponse } from '../../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { IService, ITool } from './interfaces';

class PerformerToolsService extends BaseService {
    private url: string = `${this.baseUrl}/curator/performer/tool`;

    public readonly getToolsList = (userId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IService[]>>(this.url, { params: { userId: userId }, ...options })
            .then(resp => resp.data);

    public readonly addPerformerTool = (
        params: { userId: number; toolId: number },
        options?: AxiosRequestConfig,
    ) => this.http.post<BaseResponse<ITool>>(this.url, params, options).then(resp => resp.data);

    public readonly deletePerformerTool = (
        userId: number,
        toolId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .delete(this.url, { params: { userId: userId, toolId: toolId }, ...options })
            .then(resp => resp.data);
}

export { PerformerToolsService };

export default new PerformerToolsService();
