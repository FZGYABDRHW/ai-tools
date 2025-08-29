import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { Franchise, FranchiseBankAccount } from './interface';

export class FranchiseService extends BaseService {
    private url: string = `${this.baseUrl}/franchise`;

    public getFranchiseList = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Franchise[]>>(`${this.url}`, { ...options })
            .then(resp => resp.data.response);

    public getFranchiseBankAccountList = (
        franchiseId: number,
        params?: { is_active?: boolean },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get(`${this.url}/${franchiseId}/bank-accounts`, { params, ...options })
            .then(resp => resp.data.response);
}
