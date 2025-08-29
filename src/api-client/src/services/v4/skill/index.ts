import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { GetSkillsParams, SkillList } from './interfaces';

export class SkillService extends BaseService {
    private readonly url: string = `${this.baseUrl}/skill`;

    public readonly getList = (params?: GetSkillsParams) =>
        this.http
            .get<BaseResponse<SkillList>>(`${this.url}`, { params })
            .then(resp => resp.data.response);
}

export default new SkillService();
