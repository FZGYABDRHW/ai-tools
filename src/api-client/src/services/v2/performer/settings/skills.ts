import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import { ITool } from './interfaces';
import { ISkill, ISkillsGroup, ISkillStatus } from './interfaces';
import { AxiosRequestConfig } from 'axios';

class PerformerSkillsService extends BaseService {
    private url: string = `${this.baseUrl}/performer/settings/skills`;

    public readonly getSkills = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<ReadonlyArray<ISkillsGroup>>>(this.url, options)
            .then(({ data: { response, status } }) => ({ response, status }));

    public readonly remove = (params: { skillId: number }, options?: AxiosRequestConfig) =>
        this.http
            .delete(this.url, { params, ...options })
            .then(({ data: { response, status } }) => ({ response, status }));

    public readonly request = (params: { skillId: number }, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<ISkillStatus>>(this.url, params, options)
            .then(({ data: { response, status } }) => ({ response, status }));
}
export { PerformerSkillsService };

export default new PerformerSkillsService();
