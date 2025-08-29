import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import {
    CreateParams,
    CreateResponse,
    GetFilesResponse,
    GetListParams,
    GetListResponse,
    License,
} from './interfaces';

export class LicenseService extends BaseService {
    private readonly url: string = `${this.baseUrl}`;

    public get = (id: number) =>
        this.http
            .get<BaseResponse<License>>(`${this.url}/license/${id}`)
            .then(resp => resp.data.response);

    public getList = (params: GetListParams) =>
        this.http
            .get<BaseResponse<GetListResponse>>(`${this.url}/license/list`, { params })
            .then(resp => resp.data.response);

    public getFiles = (id: number) =>
        this.http
            .get<BaseResponse<GetFilesResponse>>(`${this.url}/license/${id}/files`)
            .then(resp => resp.data.response);

    public createAndPinToTask = (taskId: number, params: CreateParams) =>
        this.http
            .post<BaseResponse<CreateResponse>>(
                `${this.url}/task/${taskId}/construction-work/license`,
                params,
            )
            .then(resp => resp.data.response);

    public remove = (id: number) =>
        this.http.delete(`${this.url}/${id}`).then(resp => resp.data.response);

    public removeAndUnpinFromTask = (taskId: number, licenseId: number) =>
        this.http
            .delete(`${this.url}/task/${taskId}/construction-work/license/${licenseId}`)
            .then(resp => resp.data.response);

    public enableConstructionWork = (taskId: number) =>
        this.http
            .patch(`${this.url}/task/${taskId}/construction-work/enable`)
            .then(resp => resp.data.response);

    public disableConstructionWork = (taskId: number) =>
        this.http
            .patch(`${this.url}/task/${taskId}/construction-work/disable`)
            .then(resp => resp.data.response);
}
