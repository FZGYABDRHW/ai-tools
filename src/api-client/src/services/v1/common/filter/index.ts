import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { ICustomSkillModel, IRegionModel, SearchTools } from './interface';

export class FilterHelpers extends BaseService {
    private url: string = `${this.baseUrl}/common/filter`;

    public readonly getSkillsList = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<ICustomSkillModel[]>>(`${this.url}/skills`, options)
            .then(resp => resp.data);

    public readonly searchRegion = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IRegionModel>>(`${this.url}/regions`, options)
            .then(resp => resp.data);

    public readonly searchTools = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<SearchTools>>(`${this.url}/tools`, options)
            .then(resp => resp.data.response);
}

export default new FilterHelpers();
