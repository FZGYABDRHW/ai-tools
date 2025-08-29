import BaseService from '../../../BaseServiceV2';
import { BaseResponse } from '../../../../interfaces';
import {
    SendMessage,
    ParamsSendMessage,
    ChangeCurator,
    Statuses,
    ParamsTickets,
    ChangeStatus,
    TicketList,
    MessagesList,
    StatsTicket,
    Ticket,
    ParamsMes,
    Message,
} from './interfaces';
import { AxiosRequestConfig } from 'axios';

export class RequestedSupports extends BaseService {
    private url = `${this.baseUrl}/curator/tools/ticket`;

    async addMessage(requestId: number, params: ParamsSendMessage, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.post<BaseResponse<Message>>(
            `${this.url}/${requestId}/message`,
            params,
            options,
        );
        return response;
    }

    async changeCurator(requestId: number, params: ChangeCurator, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.put<BaseResponse<SendMessage>>(
            `${this.url}/${requestId}/curator`,
            params,
            options,
        );
        return response;
    }

    async changeStatus(requestId: number, params: ChangeStatus, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.put<BaseResponse<SendMessage>>(
            `${this.url}/${requestId}/status`,
            params,
            options,
        );
        return response;
    }

    async deleteMessage(messageId: number, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.delete(`${this.url}/message/${messageId}`, options);
        return response;
    }

    async closeTicket(requestId: number, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.put<BaseResponse<SendMessage>>(
            `${this.url}/${requestId}/finish`,
            {},
            options,
        );
        return response;
    }

    async getTickets(params?: ParamsTickets, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<TicketList>>(`${this.url}/list`, {
            params,
            ...options,
        });
        return response;
    }

    async messagesList(requestId, params?: ParamsMes, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<MessagesList>>(`${this.url}/${requestId}/messages`, {
            params,
            ...options,
        });
        return response;
    }

    async statsTickets(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<StatsTicket>>(`${this.url}/stats`, options);
        return response;
    }

    async viewTicket(requestId, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Ticket>>(`${this.url}/${requestId}`, options);
        return response;
    }

    async statusList(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Statuses>>(`${this.url}/statuses-list`, options);
        return response;
    }

    async curatorsList(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Statuses>>(`${this.url}/curators-list`, options);
        return response;
    }

    async performersList(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Statuses>>(`${this.url}/performers-list`, options);
        return response;
    }

    getCategoryList = async (options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<Statuses[]>>(`${this.url}/category`, options)
            .then(resp => resp.data.response);

    getGroupsList = async (options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<Statuses[]>>(`${this.url}/user/group`, options)
            .then(resp => resp.data.response);

    addCategoryToTicket = async (
        requestId: number,
        categoryId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .put<BaseResponse<any>>(`${this.url}/${requestId}/category/${categoryId}`, {}, options)
            .then(resp => resp.data.response);
}

export default new RequestedSupports();
