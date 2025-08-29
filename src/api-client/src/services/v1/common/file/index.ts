import { AxiosRequestConfig } from 'axios';

import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { EditedFile, IServerMessage, File } from './interfaces';

interface IResponseUpload {
    id: number;
    mime: string;
    url: string;
    display_name: string;
    size: number;
    upload_date: string;
    is_viewed_by_user: boolean;
}

class FileService extends BaseService {
    private url: string = `${this.baseUrl}/common/file`;

    upload = (params: { type: number; model: string; file: File }, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<IResponseUpload>>(`${this.url}/alerts-user/list`, params, options)
            .then(resp => resp.data.response);

    deleteFile = (params: { id: number }, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<IServerMessage>>(`${this.url}/delete`, params, options)
            .then(resp => resp.data.response);

    renameFile = (params: { id: number; name: string }, options?: AxiosRequestConfig) =>
        this.http
            .put<BaseResponse<EditedFile>>(`${this.url}/rename`, params, options)
            .then(resp => resp.data.response);

    fileView = async (params: { id: number }, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<any>>(`${this.url}/view`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    getFileList = (userId: number, type: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<File[]>>(this.url, { ...options, params: { userId, type } })
            .then(response => response.data.response);
}

export { FileService, IResponseUpload };

export default new FileService();
