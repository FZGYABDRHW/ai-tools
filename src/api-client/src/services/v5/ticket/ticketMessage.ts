import BaseService from '../BaseServiceV5';
import { AxiosRequestConfig } from 'axios';
import { ListResponse, TicketFile, TicketMessage, TicketMessageType } from './interfaces';

export class TicketMessageService extends BaseService {
    private _url = `${this.baseUrl}/ticket`;

    public readonly getTicketMessages = (
        ticketId: number,
        params?: { limit: number; offset: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<ListResponse<TicketMessage>>(`${this._url}/${ticketId}/message`, {
                params,
                ...options,
            })
            .then(({ data }) => data);

    public readonly getTicketMessageFiles = (
        ticketId: number,
        messageId: number,
        params?: { limit: number; offset: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<ListResponse<TicketFile>>(`${this._url}/${ticketId}/message/${messageId}/file`, {
                params,
                ...options,
            })
            .then(({ data }) => data);

    public readonly addTicketMessage = (
        ticketId: number,
        params: { text: string; type: TicketMessageType; fileIds: ReadonlyArray<number> },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<TicketMessage>(`${this._url}/${ticketId}/message/add`, params, options)
            .then(({ data }) => data);

    public readonly deleteTicketMessage = (
        ticketId: number,
        messageId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .delete(`${this._url}/${ticketId}/message/${messageId}/delete`)
            .then(({ data }) => data);
}
export default new TicketMessageService();
