import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { Controls } from './interfaces';

export class ControlsService extends BaseService {
    private readonly url: string = `${this.baseUrl}/task`;

    public readonly getControls = (idTask: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Controls>>(`${this.url}/${idTask}/controls`, options)
            .then(resp => resp.data.response);
}

export default new ControlsService();
