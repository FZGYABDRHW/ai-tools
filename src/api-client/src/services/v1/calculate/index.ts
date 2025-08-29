import BaseService from '../BaseServiceV1';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { IService, ISendCompany, ISiteRegions, IBaseService } from './calculate.interfaces';

class CalculatedService extends BaseService {
    public readonly getCalculatedService = (region_id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IService>>(`${this.baseUrl}/site/calculator`, options)
            .then(resp => resp.data);

    public readonly postCompany = (params, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<ISendCompany>>(
                `${this.baseUrl}/landing/contact/company`,
                params,
                options,
            )
            .then(resp => resp.data);
}

export { CalculatedService, IService, ISendCompany, ISiteRegions, IBaseService };

export default new CalculatedService();
