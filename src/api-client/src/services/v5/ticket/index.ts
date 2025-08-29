import BaseService from '../BaseServiceV5';
import {
    TicketFilter,
    Ticket,
    ListResponse,
    TicketFilterEntity,
    TicketUser,
    TicketStatistics,
} from './interfaces';
import { AxiosRequestConfig } from 'axios';

export class TicketService extends BaseService {
    private _url = `${this.baseUrl}/ticket`;

    public addTicket = (
        params: { taskId: number; description: string },
        options?: AxiosRequestConfig,
    ) => this.http.post<Ticket>(`${this._url}/add`, params, options).then(({ data }) => data);

    public readonly closeTicket = (ticketId: number, options?: AxiosRequestConfig) =>
        this.http
            .put<Ticket>(`${this._url}/${ticketId}/close`, {}, options)
            .then(({ data }) => data);

    public readonly setTask = (ticketId: number, taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .put<Ticket>(`${this._url}/${ticketId}/set-task`, { taskId }, options)
            .then(({ data }) => data);

    public readonly rateTicket = (
        ticketId: number,
        params: { rate: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .put<Ticket>(`${this._url}/${ticketId}/rate`, params, options)
            .then(({ data }) => data);

    public readonly getTickets = (params: Partial<TicketFilter>, options?: AxiosRequestConfig) =>
        this.http
            .get<ListResponse<Ticket>>(`${this._url}`, { params, ...options })
            .then(({ data }) => data);

    public readonly getTicket = (ticketId: number, options?: AxiosRequestConfig) =>
        this.http.get<Ticket>(`${this._url}/${ticketId}`, options).then(({ data }) => data);

    public readonly changeTicketCategory = (
        ticketId: number,
        params: { categoryId: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .put<Array<null>>(`${this._url}/${ticketId}/category/set`, params, options)
            .then(({ data }) => data);

    public readonly changeTicketCurator = (
        ticketId: number,
        params: { curatorId: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .put<Array<null>>(`${this._url}/${ticketId}/user/curator/set`, params, options)
            .then(({ data }) => data);

    public readonly getTicketsCategories = (
        params?: { limit: number; offset: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<ListResponse<TicketFilterEntity>>(`${this._url}/category`, options)
            .then(({ data }) => data);

    public readonly getTicketCuratorsList = (
        params?: { limit: number; params: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<Array<number>>(`${this._url}/user/curator`, { params, ...options })
            .then(({ data }) => data);

    public readonly getTicketCuratorsForwardingList = (
        params?: { limit: number; offset: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<Array<number>>(`${this._url}/user/curator/forwarding`, { params, ...options })
            .then(({ data }) => data);

    public readonly getTicketPerformersList = (
        params?: { limit: number; params: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<ListResponse<TicketUser>>(`${this._url}/user/performer`, { params, ...options })
            .then(({ data }) => data);

    public readonly getTicketStatuses = (options?: AxiosRequestConfig) =>
        this.http
            .get<ListResponse<TicketFilterEntity>>(`${this._url}/status`, options)
            .then(({ data }) => data);

    public readonly getAvailableTicketStatuses = (ticketId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<ListResponse<TicketFilterEntity>>(`${this._url}/${ticketId}/status/next`, options)
            .then(({ data }) => data);

    public readonly changeTicketStatus = (
        ticketId: number,
        statusId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .put<TicketFilterEntity>(`${this._url}/${ticketId}/status/set`, { statusId }, options)
            .then(({ data }) => data);

    public readonly getTicketStatistics = (options?: AxiosRequestConfig) =>
        this.http
            .get<TicketStatistics>(`${this._url}/statistics`, options)
            .then(({ data }) => data);

    public readonly changeFirstLinFieldOfCurator = (
        curatorId: number,
        params: { firstLine: boolean },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .put<Array<null>>(
                `${this._url}/user/curator/${curatorId}/first-line/set`,
                params,
                options,
            )
            .then(({ data }) => data);

    public readonly getTicketCuratorFirstLineList = (
        params: { limit: number; offset: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<any>(`${this._url}/user/curator/first-line`, { params, ...options })
            .then(({ data }) => data);

    public readonly getUserGroupList = (options?: AxiosRequestConfig) =>
        this.http
            .get<ListResponse<TicketFilterEntity>>(`${this._url}/user/group`, options)
            .then(({ data }) => data);
}

export default new TicketService();
