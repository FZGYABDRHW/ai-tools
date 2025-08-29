import BaseService from '../../BaseServiceV4';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';

export class DutyService extends BaseService {
    private readonly url = (idUser: number) => `${this.baseUrl}/user/${idUser}/duty`;

    readonly getUserStatusDuty = (idUser: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<{ isDuty: boolean }>>(`${this.url(idUser)}`, options)
            .then(resp => resp.data.response);

    readonly starDuty = (idUser: number, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<void>>(`${this.url(idUser)}`, {}, options)
            .then(resp => resp.data);

    readonly stopDuty = (idUser: number, options?: AxiosRequestConfig) =>
        this.http.delete(`${this.url(idUser)}`, options).then(resp => resp.data);
}

export default new DutyService();
