import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { IService, ITool } from './interfaces';

class PerformerToolsService extends BaseService {
    private url: string = `${this.baseUrl}/curator/performer/tool`;

    async getToolsList(userId: number, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<IService[]>>(this.url, {
            params: { userId: userId },
            ...options,
        });
        return response;
    }

    async addPerformerTool(
        params: { userId: number; toolId: number },
        options?: AxiosRequestConfig,
    ) {
        const {
            data: { response },
        } = await this.http.post<BaseResponse<ITool>>(this.url, params, options);
        return response;
    }

    async deletePerformerTool(userId: number, toolId: number, options?: AxiosRequestConfig) {
        const {
            data: { status },
        } = await this.http.delete(this.url, {
            params: { userId: userId, toolId: toolId },
            ...options,
        });
        return status;
    }
}

export { PerformerToolsService };

export default new PerformerToolsService();
