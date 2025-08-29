import BaseService from '../../../BaseServiceV1';
import { BaseResponse } from '../../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { GetSkill, SendSkill, Calls } from './interfaces';

class PerformerSkillsService extends BaseService {
    serviceUrl: string = `${this.baseUrl}/curator/performer/skill`;

    public readonly getSkillsList = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<GetSkill>>(`${this.serviceUrl}/list`, {
                params: { user: id },
                ...options,
            })
            .then(resp => resp.data);

    public readonly skillApprove = (
        params: { userId: number; skillId: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<SendSkill>>(`${this.serviceUrl}/approve`, params, options)
            .then(resp => resp.data);

    public readonly skillReject = (
        params: { userId: number; skillId: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<SendSkill>>(`${this.serviceUrl}/reject`, params, options)
            .then(resp => resp.data);

    public readonly getCalls = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Calls>>(`${this.serviceUrl}/calls`, { params: { userId: id } })
            .then(resp => resp.data);

    public readonly missedCall = (params: { userId: number }, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<Calls>>(`${this.serviceUrl}/calls`, params, options)
            .then(resp => resp.data);
}

export { PerformerSkillsService };

export default new PerformerSkillsService();
