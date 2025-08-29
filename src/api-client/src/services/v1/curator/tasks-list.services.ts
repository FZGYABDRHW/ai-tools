import BaseService from '../BaseServiceV1';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import {
    ITabsTaskCountInfo,
    IQueryCuratorTaskList,
    IQueryOrganizationTaskList,
    ICuratorTaskCount,
    ITaskListResponse,
    ITaskListFilters,
    IResponseGetHelp,
    IResponseGetNotification,
} from './tasks-list.interfaces';

export class TasksListService extends BaseService {
    private readonly url = `${this.baseUrl}/curator`;

    public readonly getOrganisationUserTaskList = (
        query: IQueryOrganizationTaskList,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<ITaskListResponse>>(`${this.url}/organisation/user-task-list`, {
                params: query,
                ...options,
            })
            .then(resp => resp.data);

    public readonly getCuratorTaskList = (
        query: IQueryCuratorTaskList,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<ITaskListResponse>>(`${this.url}/task-list/list`, options)
            .then(resp => resp.data);

    public readonly getHelp = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IResponseGetHelp[]>>(`${this.url}/task/task/appropriate`, {
                params: { id: id },
                ...options,
            })
            .then(resp => resp.data);

    async getNotification(id: number, options?: AxiosRequestConfig) {
        const url = `${this.baseUrl}/curator/task/task/notifications`;
        const {
            data: { response },
        } = await this.http.get<BaseResponse<IResponseGetNotification[]>>(url, {
            params: { id: id },
            ...options,
        });
        return response;
    }
}

export default new TasksListService();
