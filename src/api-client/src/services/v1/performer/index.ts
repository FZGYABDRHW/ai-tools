import BaseService from '../BaseServiceV1';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import {
    IPerformerPopup,
    IRating,
    IRatingHistory,
    ITasksLimit,
    MessageConfirm,
    PerformerWallet,
    PerformerTaskResponse,
    TaskListParams,
    TasksInfo,
} from './interfaces';

export class PerformerService extends BaseService {
    private readonly url: string = `${this.baseUrl}/performer`;

    getTasksLimit = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<ITasksLimit>>(`${this.url}/settings/tasks-limit`, options)
            .then(resp => resp.data.response.limit);

    getTaskListInfo = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<TasksInfo>>(`${this.url}/task-list/info`, options)
            .then(({ data: { response } }) => response);

    getTaskList = (params: Partial<TaskListParams>, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<PerformerTaskResponse>>(`${this.url}/task-list`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    getNewTask = (params: Partial<TaskListParams>, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<PerformerTaskResponse>>(`${this.url}/task-list/new`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    getRating = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IRating>>(`${this.url}/rating`, options)
            .then(resp => resp.data.response);

    getRatingHistory = (offset: number = 0, limit: number = 20, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IRatingHistory>>(`${this.url}/rating/history`, {
                params: {
                    offset: offset,
                    limit: limit,
                },
                ...options,
            })
            .then(resp => resp.data.response);

    getPerformerPopups = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IPerformerPopup[]>>(`${this.url}/popup/rating`, options)
            .then(resp => resp.data.response);

    deletePerformerCard = (params: { card_number: number }, options?: AxiosRequestConfig) =>
        this.http
            .delete(`${this.url}/wallet/card`, { params, ...options })
            .then(resp => resp.data.response);

    getPerformerWalletList = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<PerformerWallet>>(`${this.url}/wallet/list`, options)
            .then(resp => resp.data.response);

    getPerformerQuestionnaire = (shopId, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IRatingHistory>>(`${this.url}/${shopId}/questionnaire`, options)
            .then(resp => resp.data.response);

    sendPerformerQuestionnaire = (shopId, answers, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<MessageConfirm>>(
                `${this.url}/${shopId}/shop/questionnaire`,
                { answers },
                options,
            )
            .then(resp => resp.data.status);

    getPerformerQuestionnaireFormatted = (shopId, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<any>>(`${this.url}/${shopId}/shop/questionnaire/formatted`, options)
            .then(resp => resp.data.response);
}

export default new PerformerService();
