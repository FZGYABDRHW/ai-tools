import { AxiosRequestConfig } from 'axios';
import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import { FirstPickerDate } from './interfaces';

export class OrganizationWidget extends BaseService {
    private url = `${this.baseUrl}/organization/widget`;

    getOrganizationBalance = async (options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<any>>(`${this.url}/balance`, options)
            .then(resp => resp.data.response);

    getFirstPickerDate = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<FirstPickerDate>>(`${this.url}/first-picker-date`, options)
            .then(resp => resp.data.response);
}

export default new OrganizationWidget();
