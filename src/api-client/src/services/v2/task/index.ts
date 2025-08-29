import BaseService from '../BaseServiceV2';
import { BaseResponse } from '../../interfaces';
import { Receipt } from './interfaces';
import { AxiosRequestConfig } from 'axios';

export class TaskService extends BaseService {
    private readonly _url = `${this.baseUrl}/task`;

    public readonly getExpendableReceipt = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<{ receipts: ReadonlyArray<Receipt> }>>(
                `${this._url}/${taskId}/expendable-receipt`,
                options,
            )
            .then(resp => resp.data.response);

    public readonly deleteQr = (
        taskId: number,
        receiptId: number,
        params: { id: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .delete(`${this._url}/${taskId}/expendable-receipt/${receiptId}`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);
}

export default new TaskService();
