import BaseService from '../BaseServiceV2';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { SupplierApiAnswer, Supplier } from './interface';

export class SupplierService extends BaseService {
    private url = `${this.baseUrl}/supplier`;

    public createSupplier = (params: Supplier, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<SupplierApiAnswer>>(`${this.url}`, params, options)
            .then(resp => resp.data.response);
}
