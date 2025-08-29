import BaseService from '../../../BaseServiceV1';
import { BaseResponse } from '../../../../interfaces';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';
import { SaleManagerInfo } from './interface';

export class SaleManagerService extends BaseService {
    private readonly url = `${this.baseUrl}/common/user`;

    public readonly getSaleManager = async (userId: number, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<SaleManagerInfo>>(`${this.url}/${userId}/sale-manager`, options)
            .then<SaleManagerInfo>(resp => resp.data.response);
}

export default new SaleManagerService();
