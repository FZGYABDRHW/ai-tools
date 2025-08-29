import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';

export class ValidatorService extends BaseService {
    private readonly postValidatorPassport = (
        params: { passport: string },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<any>>(`${this.baseUrl}/common/validator/passport`, params, options)
            .then(resp => resp.data);
}

export default new ValidatorService();
