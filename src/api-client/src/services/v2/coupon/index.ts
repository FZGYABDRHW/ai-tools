import { AxiosRequestConfig } from 'axios';

import BaseService from '../BaseServiceV2';
import { BaseResponse } from '../../interfaces';
import { ServiceActivationParams, ServiceActivationResponse } from './interfaces';

export class CouponService extends BaseService {
    private url: string = `${this.baseUrl}/coupon`;

    activateService = (data: ServiceActivationParams, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<ServiceActivationResponse>>(`${this.url}/activate`, data, options)
            .then(response => response.data.response);
}
