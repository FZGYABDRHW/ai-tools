import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { GetSkill, SendSkill, Calls } from './interfaces';

class PerformerSkillsService extends BaseService {
    serviceUrl: string = `${this.baseUrl}/curator/performer/skill`;

    async getSkillsList(id: number, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<GetSkill>>(`${this.serviceUrl}/list`, {
            params: { userId: id },
            ...options,
        });
        return response;
    }

    async skillApprove(params: { userId: number; skillId: number }, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.post<BaseResponse<SendSkill>>(
            `${this.serviceUrl}/approve`,
            params,
            options,
        );
        return response;
    }

    async skillReject(params: { userId: number; skillId: number }, options?: AxiosRequestConfig) {
        const {
            data: { status },
        } = await this.http.post<BaseResponse<SendSkill>>(
            `${this.serviceUrl}/reject`,
            params,
            options,
        );
        return status;
    }

    async getCalls(id: number, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Calls>>(`${this.serviceUrl}/calls`, {
            params: { userId: id },
            ...options,
        });
        return response;
    }

    async missedCall(params: { userId: number }, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.post<BaseResponse<Calls>>(`${this.serviceUrl}/calls`, params, options);
        return response;
    }
}

export { PerformerSkillsService };

export default new PerformerSkillsService();
