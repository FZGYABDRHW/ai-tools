import axios, { AxiosRequestConfig } from 'axios';

import BaseService from '../BaseServiceV1';
import { BaseResponse, FileFromServer } from '../../interfaces';
import { VirtualInfo } from './user/info.interfaces';
import { GetVirtualPhoneNumber } from './interfaces';

export const source = axios.CancelToken.source();

export class CommonService extends BaseService {
    private readonly url = `${this.baseUrl}/common`;

    public readonly getFile = (id: number, size?: string, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<any>>(`${this.url}/file/view`, {
                params: {
                    id,
                    size,
                    responseType: 'blob',
                },
                ...options,
            })
            .then(resp =>
                (window.URL ? URL : (window as any).webkitURL).createObjectURL(resp.data),
            );

    public readonly uploadFile = (
        file: any,
        type: number,
        model?: number,
        shopId?: number,
        options?: AxiosRequestConfig,
    ) => {
        const data = new FormData();
        data.append('file', file);
        data.append('type', type.toString());
        data.append('model', model ? model.toString() : null);
        return this.http
            .post<BaseResponse<FileFromServer>>(`${this.url}/file/upload`, data, {
                ...options,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                cancelToken: source.token,
            })
            .then(resp => resp.data.response);
    };

    public readonly deleteFile = (params: { id: number }, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<void>>(`${this.url}/file/delete`, {
                ...params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly renameFile = (id: number, name: string, options?: AxiosRequestConfig) =>
        this.http
            .put<BaseResponse<FileFromServer>>(`${this.url}/file/rename`, {
                id,
                name,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly getVirtualPhoneNumber = ({ entityName, entityId }: GetVirtualPhoneNumber) =>
        this.http
            .get<BaseResponse<VirtualInfo>>(
                `${this.url}/virtual-contact-info/${entityName}/${entityId}`,
            )
            .then(resp => resp.data.response);

    public readonly getCommentTermsList = (taskId: number) =>
        this.http
            .get<BaseResponse<string[]>>(`${this.url}/task/${taskId}/comment-terms`)
            .then(resp => resp.data.response);
}

export default new CommonService();
