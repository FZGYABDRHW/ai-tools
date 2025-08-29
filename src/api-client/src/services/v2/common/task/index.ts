import { AxiosRequestConfig } from 'axios';
import BaseService from '../../BaseServiceV2';
import { BaseResponse, FileFromServer } from '../../../interfaces';
import { ReceiptList, Response, SendQrData } from './interfaces';
import task from '../../../v1/landing/task';

export class TaskService extends BaseService {
    private readonly url: string = `${this.baseUrl}/common/task`;

    public readonly getReceiptsList = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<{ receipts: ReceiptList }>>(
                `${this.url}/${taskId}/expendable-receipt`,
                options,
            )
            .then(resp => resp.data);

    public readonly getReceipt = (
        taskId: number,
        receiptId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Response>>(
                `${this.url}/${taskId}/expendable-receipt/${receiptId}`,
                options,
            )
            .then(resp => resp.data);

    public readonly sendReceipt = (
        taskId: number,
        params: SendQrData,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<FileFromServer>>(`${this.url}/${taskId}/expendable-receipt`, options)
            .then(resp => resp.data);
}

export default new TaskService();
