import BaseService from '../BaseServiceV4';
import { BaseResponse, FileFromServer } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import {
    AdditionalRequirements,
    GetEventsParams,
    List,
    TaskAttachment,
    Event,
    PostedEvent,
    Task,
    UpdateArrivalParams,
    ParamsUpdateTask,
    UnassignParams,
    Discount,
    Work,
    WorkTotalPrice,
    Arrivals,
    B2B2CFormParams,
    TaskRating,
    Arrival,
    CategoriesParam,
    CalculatePlanCloseDateParams,
    PerformerAttachmentsQuery,
    UpdateTaskContract,
    TaskListParams,
    ContractorArrivalDateStatuses,
    IPostCommentParams,
    EventAttachmentsList,
    PerformerInvoice,
    EditPerformerInvoicePayload,
    CreatePerformerInvoicePayload,
    SetVatStrategyParams,
    ApprovePerformerInvoicePayload,
    ExtraFields,
    PerformerRejectParams,
    CancelReason,
} from './interfaces';
import { Maybe } from 'tsmonad';
import { File } from '../../v1/organization/task/interfaces';
import { CancelReasons } from './interfaces';

export type eventType = 'comment' | 'annotation' | 'log';

export interface ListParams {
    limit: number;
    offset: number;
    types?: eventType[];
}

export class TaskService extends BaseService {
    private readonly url: string = `${this.baseUrl}/task`;

    public readonly get = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Task>>(`${this.url}/${id}`, options)
            .then(resp => resp.data.response);

    public readonly getList = (params: TaskListParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<List<Task>>>(`${this.url}`, { params, ...options })
            .then(response => response.data.response);

    public readonly updateTask = (
        taskId: number,
        params: ParamsUpdateTask,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .patch<BaseResponse<void>>(`${this.url}/${taskId}`, params, options)
            .then(resp => resp.data.response);

    public readonly unassignPerformer = (
        id: number,
        params: UnassignParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<null>>(`${this.url}/${id}/unassign-performer`, params, options)
            .then(resp => resp.data.response);

    public readonly addAdditionalRequirements = (
        taskId: number,
        requirementKey: string,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<any>>(
                `${this.url}/${taskId}/requirement`,
                { key: requirementKey },
                options,
            )
            .then(resp => resp.data.response);

    public readonly deleteAdditionalRequirements = (
        taskId: number,
        requirementId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .delete(`${this.url}/${taskId}/requirement/${requirementId}`, options)
            .then(resp => resp.data.response);

    public readonly getAdditionalRequirements = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<List<AdditionalRequirements>>>(
                `${this.url}/${taskId}/requirement`,
                options,
            )
            .then(resp => resp.data.response);

    public readonly getActiveSuitablePerformers = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<any>>(`${this.url}/${taskId}/performer/suitable/active`, options)
            .then(resp => resp.data);

    public readonly toggleCashlessPayment = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .post(`${this.url}/${taskId}/cashless`, {}, options)
            .then(resp => resp.data.response);

    public readonly sendNotification = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .post(`${this.url}/${taskId}/send-notification`, {}, options)
            .then(resp => resp.data.response);

    public readonly getWorksList = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<{ items: Work[] }>>(`${this.url}/${taskId}/work`, options)
            .then(resp => resp.data.response);

    public readonly getWorkPrice = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<WorkTotalPrice>>(`${this.url}/${taskId}/work/price`, options)
            .then(resp => resp.data.response);

    public readonly getRejectedWorkList = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<{ items: Work[] }>>(`${this.url}/${taskId}/work/rejected`, options)
            .then(resp => resp.data.response);

    public readonly getPerformerArrivals = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Arrivals>>(`${this.url}/${taskId}/arrivals`, options)
            .then(resp => resp.data.response);

    public readonly getContractorPlannedArrival = async (
        taskId: number,
        options?: AxiosRequestConfig,
    ): Promise<Arrival> =>
        this.getPerformerArrivals(taskId, {
            ...options,
            params: {
                limit: 1,
                offset: 0,
                statuses: [ContractorArrivalDateStatuses.PLANNED],
            },
        }).then(response => (response.items.length ? response.items[0] : null));

    public readonly addNewArrival = (
        taskId: number,
        params: { date: string },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<null>>(`${this.url}/${taskId}/arrivals`, params, options)
            .then(response => response.data.response);

    public readonly updateArrivalDate = async (
        taskId: number,
        params: UpdateArrivalParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .put<BaseResponse<null>>(`${this.url}/${taskId}/arrivals`, params, options)
            .then(response => response.data.response);

    public getTaskPerformerAttachments = (
        taskId: number,
        params: PerformerAttachmentsQuery,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<List<TaskAttachment>>>(`${this.url}/${taskId}/attachment/performer`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    readonly getEvents = (taskId, params: GetEventsParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<List<Event>>>(`${this.url}/${taskId}/event`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    readonly getEventAttachments = (eventId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<EventAttachmentsList>>(
                `${this.url}/comment/${eventId}/files`,
                options,
            )
            .then(resp => resp.data.response);

    readonly postComment = (
        taskId: number,
        params: IPostCommentParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<PostedEvent>>(`${this.url}/${taskId}/event`, params, options)
            .then(resp => resp.data.response);

    readonly performerReject = (taskId: number, params: PerformerRejectParams) =>
        this.http
            .post<BaseResponse<null>>(`${this.url}/${taskId}/performer-reject`, params)
            .then(resp => resp.data.response);

    readonly deleteComment = (taskId: number, eventId: number, options?: AxiosRequestConfig) =>
        this.http
            .delete(`${this.url}/${taskId}/event/${eventId}`, options)
            .then(resp => resp.data.response);

    readonly changeTaskContract = (
        taskId,
        data: UpdateTaskContract,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .put(`${this.url}/${taskId}/change-contract`, data, options)
            .then(resp => resp.data.response);

    post<T>(data: T, options?: AxiosRequestConfig) {
        return this.http.post(this.url, data, options).then(resp => resp.data.response);
    }

    getExecutionAddress(taskId: number, options?: AxiosRequestConfig) {
        return this.http
            .get<BaseResponse<List<Event>>>(`${this.url}/${taskId}/execution-address`, {
                ...options,
            })
            .then(resp => resp.data.response);
    }

    getTaskRating = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<TaskRating>>(`${this.url}/${taskId}/rating`, options)
            .then(resp => resp.data.response);

    calculatePlanCloseDate = (data: CalculatePlanCloseDateParams, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<{ planCloseDate: string }>>(
                `${this.url}/calculate-plan-close-date`,
                data,
                options,
            )
            .then(resp => resp.data.response);

    getPlanCloseDate = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<{ planCloseDate: string }>>(
                `${this.url}/${taskId}/plan-close-date`,
                options,
            )
            .then(resp => resp.data.response);

    getCloneAttachmentFiles = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<File[]>>(`${this.url}/${taskId}/attachment/clone`, options)
            .then(resp => resp.data.response);

    setDateOfAct = (taskId: number, date: string) => {
        return this.http
            .patch<BaseResponse<null>>(`${this.url}/${taskId}/act-of-completed-work-date`, {
                date: date,
            })
            .then(resp => resp.data);
    };

    public readonly liftPriority = async (taskId: number, options?: AxiosRequestConfig) => {
        await this.http
            .put<BaseResponse<null>>(
                `${this.url}/${taskId}/change-priority`,
                { taskId: taskId },
                options,
            )
            .then(resp => resp.data.response);
    };

    public readonly getTaskImportance = async (taskId: number, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<{ important: boolean }>>(`${this.url}/${taskId}/important`, options)
            .then(resp => resp.data.response);

    public readonly setTaskImportance = async (taskId: number, options?: AxiosRequestConfig) =>
        await this.http
            .post<BaseResponse<null>>(`${this.url}/${taskId}/important`, {}, options)
            .then(resp => resp.data.response);

    public readonly removeTaskImportance = async (taskId: number, options?: AxiosRequestConfig) =>
        await this.http
            .delete(`${this.url}/${taskId}/important`, options)
            .then(resp => resp.data.response);

    public readonly getPerformerInvoice = async (taskId: number, options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<PerformerInvoice | null>>(`${this.url}/${taskId}/invoice`, options)
            .then(resp => resp.data.response);

    public readonly createPerformerInvoice = async (
        taskId: number,
        params: CreatePerformerInvoicePayload,
        options?: AxiosRequestConfig,
    ) =>
        await this.http
            .post<BaseResponse<PerformerInvoice>>(`${this.url}/${taskId}/invoice`, params, options)
            .then(resp => resp.data.response);

    public readonly approvePerformerInvoice = async (
        taskId: number,
        params: ApprovePerformerInvoicePayload,
    ) =>
        await this.http
            .patch<BaseResponse<PerformerInvoice>>(`${this.url}/invoice/${taskId}/approve`, params)
            .then(resp => resp.data.response);

    public readonly editPerformerInvoice = async (
        id: number,
        params: EditPerformerInvoicePayload,
        options?: AxiosRequestConfig,
    ) =>
        await this.http
            .put<BaseResponse<PerformerInvoice>>(`${this.url}/invoice/${id}`, params, options)
            .then(resp => resp.data.response);

    public readonly getPerformerInvoiceFiles = async (
        taskId: number,
        options?: AxiosRequestConfig,
    ) =>
        await this.http
            .get<BaseResponse<FileFromServer[]>>(`${this.url}/${taskId}/invoice/files`, options)
            .then(resp => resp.data.response);

    public readonly setVatStrategy = (taskId: number, params: SetVatStrategyParams) =>
        this.http
            .patch<BaseResponse<null>>(`${this.url}/${taskId}/set-vat-strategy`, params)
            .then(resp => resp.data.response);

    public readonly getExtraFields = (taskId: number) =>
        this.http
            .get<BaseResponse<ExtraFields>>(`${this.url}/${taskId}/extra-fields`)
            .then(resp => resp.data.response);

    public readonly notifyPerformersAboutNewTask = async (taskId: number) =>
        await this.http
            .post<BaseResponse<null>>(`${this.url}/${taskId}/notify-performers-about-new-task`, {})
            .then(resp => resp.data.response);

    public readonly enableArriveOnTime = (taskId: number) =>
        this.http
            .patch<BaseResponse<null>>(`${this.url}/${taskId}/arrive-on-time/enable`)
            .then(resp => resp.data.response);

    public readonly disableArriveOnTime = (taskId: number) =>
        this.http
            .patch<BaseResponse<null>>(`${this.url}/${taskId}/arrive-on-time/disable`)
            .then(resp => resp.data.response);

    public readonly getCancelReasons = (taskId: number) =>
        this.http
            .get<BaseResponse<CancelReasons>>(`${this.url}/${taskId}/cancel-reasons`)
            .then(resp => resp.data.response);

    public readonly getCancelReason = (taskId: number) =>
        this.http
            .get<BaseResponse<CancelReason | null>>(`${this.url}/${taskId}/cancel-reason`)
            .then(resp => resp.data.response);

    public readonly refusePerformer = (taskId: number) =>
        this.http
            .post<BaseResponse<null>>(`${this.url}/${taskId}/refuse-performer`, {})
            .then(resp => resp.data.response);
}

export default new TaskService();
