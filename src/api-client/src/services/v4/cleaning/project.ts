import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import {
    List,
    Project,
    Category,
    ProjectCreate,
    CategoryRequest,
    AllCleanProjects,
    PerformerPayout,
    TaskPerformerInfo,
    CategoryWithPerformer,
    CalendarPlanDate,
    GetCalendarPlanParams,
    TaskCategory,
    EventOptions,
    EventResponse,
    CleaningTask,
    CleaningProject,
    GetTasksForProjectParams,
    ListServicesWithPerformer,
    TaskExpendableReceipt,
    Categories,
    EditProjectParams,
    SuitablePerformerCleaningProject,
    ProjectCategoryShop,
    TaskListParams,
    InventoryRequest,
    Inventory,
    CategoryListItem,
    CreateEventParams,
    UpdateEventParams,
    ProjectPayout,
    AssignPerformerParams,
    DissmissPerformerParams,
    TaskAttachment,
    TaskPayoutInfo,
    CurrentDate,
    GetProjectParams,
    TaskCompensationListParams,
    NotificationChannel,
    NotificationChannels,
} from './interfaces';

import { TaskCompensation } from './task/interfaces';
import { notificationConfigAdapter } from './adapter';

export interface SendQrData {
    receipt_fn: string;
    receipt_fd: string;
    receipt_fpd: string;
}

export class CleaningProjectService extends BaseService {
    private readonly url: string = `${this.baseUrl}/cleaning/project`;

    public readonly getProjects = (params: GetProjectParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<AllCleanProjects>>(`${this.url}`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getProject = (id: number, params?: CurrentDate, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Project>>(`${this.url}/${id}`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getTaskForProject = (
        idProject: number,
        params: GetTasksForProjectParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<List<CleaningTask>>>(`${this.url}/${idProject}/task`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly getTask = (taskId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<CleaningTask>>(`${this.url}/task/${taskId}`, options)
            .then(resp => resp.data.response);

    public readonly getProjectPayout = (
        projectId: number,
        params: { startDate: string; endDate: string },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<ProjectPayout>>(`${this.url}/${projectId}/payout`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly createProjectPayout = (
        projectId: number,
        params: { startDate: string; endDate: string },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<void>>(`${this.url}/${projectId}/payout`, params, options)
            .then(resp => resp.data.response);

    public readonly getListPerformerWithServices = (
        projectId: number,
        taskId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<ListServicesWithPerformer>>(
                `${this.url}/${projectId}/task/${taskId}/performer`,
                options,
            )
            .then(resp => resp.data.response);

    public readonly editProject = (project: EditProjectParams, options?: AxiosRequestConfig) =>
        this.http
            .put<BaseResponse<null>>(`${this.url}/${project.id}`, project, options)
            .then(resp => resp.data.response);

    public readonly createProject = (project: ProjectCreate, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<{ id: number }>>(`${this.url}`, project, options)
            .then(resp => resp.data.response);

    public readonly getCategoryForProject = (projectId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Categories>>(`${this.url}/${projectId}/category`, options)
            .then(resp => resp.data.response);

    public readonly getTaskCalendarPlanForDay = (
        relatedEntityId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<CalendarPlanDate>>(
                `${this.url}/task/calendar/${relatedEntityId}`,
                options,
            )
            .then(resp => resp.data.response);

    public readonly getListTaskEvents = (
        projectId: number,
        taskId: number,
        eventOptions?: EventOptions,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<EventResponse>>(`${this.url}/${projectId}/task/${taskId}/event`, {
                ...options,
                params: eventOptions,
            })
            .then(resp => resp.data.response);

    public readonly createTaskEvent = (
        projectId: number,
        taskId: number,
        params: CreateEventParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<Event>>(
                `${this.url}/${projectId}/task/${taskId}/event`,
                params,
                options,
            )
            .then(resp => resp.data.response);

    public readonly updateTaskEvent = (
        projectId: number,
        taskId: number,
        eventId: number,
        params: UpdateEventParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .put(`${this.url}/${projectId}/task/${taskId}/event/${eventId}`, params, options)
            .then<BaseResponse<Event>>(resp => resp.data.response);

    public readonly deleteTaskEvent = (
        projectId: number,
        taskId: number,
        eventId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .delete(`${this.url}/${projectId}/task/${taskId}/event/${eventId}`, options)
            .then<BaseResponse<null>>(resp => resp.data.response);

    public readonly addCategory = (
        projectId: number,
        category: CategoryRequest,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<null>>(`${this.url}/${projectId}/category`, category, options)
            .then(resp => resp.data.response);

    public readonly editCategory = (v: Category, options?: AxiosRequestConfig) =>
        this.http
            .put<BaseResponse<null>>(`${this.url}/${v.projectId}/category/${v.id}`, v, options)
            .then(resp => resp.data.response);

    public readonly deleteCategory = (
        projectId: number,
        categoryId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .delete(`${this.url}/${projectId}/category/${categoryId}`, options)
            .then(resp => resp.data.response);

    public readonly getProjectCategoryShops = (
        projectId: number,
        categoryId: number,
        params?: { limit: number; offset: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<List<ProjectCategoryShop>>>(
                `${this.url}/${projectId}/category/${categoryId}/shop`,
                { params, ...options },
            )
            .then(resp => resp.data.response);

    public readonly getTaskInventory = (
        projectId: number,
        taskId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<List<Inventory>>>(
                `${this.url}/${projectId}/task/${taskId}/inventory`,
                options,
            )
            .then(resp => resp.data.response);

    public readonly createTaskInventory = (
        projectId: number,
        taskId: number,
        inventory: InventoryRequest,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<void>>(
                `${this.url}/${projectId}/task/${taskId}/inventory`,
                inventory,
                options,
            )
            .then(resp => resp.data.response);

    public readonly updateTaskInventory = (
        projectId: number,
        taskId: number,
        inventory: Inventory,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .put<BaseResponse<void>>(
                `${this.url}/${projectId}/task/${taskId}/inventory/${inventory.id}`,
                inventory,
                options,
            )
            .then(resp => resp.data.response);

    public readonly deleteTaskInventory = (
        projectId: number,
        taskId: number,
        inventoryId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .delete(`${this.url}/${projectId}/task/${taskId}/inventory/${inventoryId}`, options)
            .then(resp => resp.data.response);

    public readonly getTaskExpendableReceipt = (
        projectId: number,
        taskId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<List<TaskExpendableReceipt>>>(
                `${this.url}/${projectId}/task/${taskId}/expendable-receipt`,
                options,
            )
            .then(resp => resp.data.response);

    public readonly deleteTaskExpendableReceipt = (
        projectId: number,
        taskId: number,
        receiptId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .delete(
                `${this.url}/${projectId}/task/${taskId}/expendable-receipt/${receiptId}`,
                options,
            )
            .then(resp => resp.data.response);

    public readonly createTaskExpendableReceipt = (
        projectId: number,
        taskId: number,
        data: SendQrData,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<void>>(
                `${this.url}/${projectId}/task/${taskId}/expendable-receipt`,
                data,
                options,
            )
            .then(resp => resp.data.response);

    public readonly getTaskPerformers = (
        projectId: number,
        taskId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<List<TaskPerformerInfo>>>(
                `${this.url}/${projectId}/task/${taskId}/performer`,
                options,
            )
            .then(resp => resp.data.response);

    public readonly updateTaskCalendarPlan = (
        projectId: number,
        taskId: number,
        calendarId: number,
        incomplete: boolean,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .put<BaseResponse<void>>(
                `${this.url}/${projectId}/task/${taskId}/calendar/${calendarId}`,
                { incomplete },
                options,
            )
            .then(resp => resp.data.response);

    public readonly getListSuitablePerformers = (
        projectId: number,
        taskId: number,
        params: { projectCategoryId: number; query?: string; limit?: number; offset?: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<List<SuitablePerformerCleaningProject>>>(
                `${this.url}/${projectId}/task/${taskId}/performer/suitable`,
                { params, ...options },
            )
            .then(resp => resp.data.response);

    public readonly assignPerformerOnService = (
        projectId: number,
        taskId: number,
        performerId: number,
        params: AssignPerformerParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<void>>(
                `${this.url}/${projectId}/task/${taskId}/performer/${performerId}/assign`,
                params,
                options,
            )
            .then(resp => resp.data.response);

    public readonly dismissPerformerOnService = (
        projectId: number,
        taskId: number,
        performerId: number,
        params: DissmissPerformerParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .delete(`${this.url}/${projectId}/task/${taskId}/performer/${performerId}/dismiss`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly assignHunterOnTask = (
        projectId: number,
        taskId: number,
        hunterId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<void>>(
                `${this.url}/${projectId}/task/${taskId}/hunter/${hunterId}/assign`,
                {},
                options,
            )
            .then(resp => resp.data.response);

    public readonly getTaskAttachments = (
        projectId: number,
        taskId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<{ items: ReadonlyArray<TaskAttachment> }>>(
                `${this.url}/${projectId}/task/${taskId}/attachment`,
                options,
            )
            .then(resp => resp.data.response);

    public readonly getTaskCategoryList = (
        projectId: number,
        taskId: number,
        params?: Partial<TaskListParams>,
    ) =>
        this.http
            .get<BaseResponse<List<CategoryListItem>>>(
                `${this.url}/${projectId}/task/${taskId}/category`,
                { params },
            )
            .then(resp => resp.data.response);

    public readonly getProjectCategories = (
        id: number,
        params?: { withoutCompleted: boolean },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<{ items: ReadonlyArray<Category> }>>(`${this.url}/${id}/category`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly getCategory = (
        projectId: number,
        categoryId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Category>>(`${this.url}/${projectId}/category/${categoryId}`, options)
            .then(resp => resp.data.response);

    public readonly getTaskCategory = (
        projectId: number,
        taskId: number,
        projectCategoryId: number,
        performerId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<TaskCategory>>(`${this.url}/${projectId}/task/${taskId}/category`, {
                params: {
                    performerId,
                    projectCategoryId,
                },
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly getCategoriesListWithPerformers = (
        projectId: number,
        taskId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<List<CategoryWithPerformer>>>(
                `${this.url}/${projectId}/task/${taskId}/performer`,
                options,
            )
            .then(resp => resp.data.response);

    public readonly getTaskPayout = (
        projectId: number,
        taskId: number,
        params: TaskPayoutInfo,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<PerformerPayout>>(`${this.url}/${projectId}/task/${taskId}/payout`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly taskPayout = (
        projectId: number,
        taskId: number,
        params: TaskPayoutInfo,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<void>>(
                `${this.url}/${projectId}/task/${taskId}/payout`,
                params,
                options,
            )
            .then(resp => resp.data.response);

    public readonly taskInventoryPayout = (
        projectId: number,
        taskId: number,
        inventoryId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<void>>(
                `${this.url}/${projectId}/task/${taskId}/inventory/${inventoryId}/payout`,
                {},
                options,
            )
            .then(resp => resp.data.response);

    public readonly getTaskCalendarPlan = (
        projectId: number,
        taskId: number,
        params?: Partial<GetCalendarPlanParams>,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<List<CalendarPlanDate>>>(
                `${this.url}/${projectId}/task/${taskId}/calendar`,
                {
                    params,
                    ...options,
                },
            )
            .then(resp => resp.data.response);

    public readonly getProjectCategoryView = (
        projectId: number,
        categoryId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Category>>(`${this.url}/${projectId}/category/${categoryId}`, options)
            .then(resp => resp.data.response);

    public readonly updateCleaningTask = (
        projectId: number,
        taskId: number,
        status: string,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .patch<BaseResponse<CleaningTask>>(`${this.url}/${projectId}/task/${taskId}`, {
                status,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly getTaskCompensationList = (
        projectId: number,
        taskId: number,
        params?: Partial<TaskCompensationListParams>,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<List<TaskCompensation>>>(
                `${this.url}/${projectId}/task/${taskId}/compensation`,
                { params, ...options },
            )
            .then(response => response.data.response);

    public readonly assignPerformerCompensation = (
        projectId: number,
        taskId: number,
        compensationId: number,
        performerId: number,
    ) =>
        this.http
            .patch<BaseResponse<void>>(
                `${
                    this.url
                }/${projectId}/task/${taskId}/compensation/${compensationId}/performer/${performerId}/assign`,
            )
            .then(response => response.data.response);

    public readonly dismissPerformerCompensation = (
        projectId: number,
        taskId: number,
        compensationId: number,
    ) =>
        this.http
            .patch<BaseResponse<void>>(
                `${
                    this.url
                }/${projectId}/task/${taskId}/compensation/${compensationId}/performer/dismiss`,
            )
            .then(response => response.data.response);

    public readonly payoutPerformerCompensation = (
        projectId: number,
        taskId: number,
        compensationId: number,
    ) =>
        this.http
            .patch<BaseResponse<void>>(
                `${this.url}/${projectId}/task/${taskId}/compensation/${compensationId}/payout`,
            )
            .then(response => response.data.response);

    public readonly setNotificationConfig = (
        projectId: number,
        shopId: number,
        params: NotificationChannel,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<void>>(
                `${this.url}/${projectId}/category/shop/${shopId}/notification-config`,
                params,
                options,
            )
            .then(response => response.data.response);

    public readonly getNotificationConfigs = (projectId: number, shopId: number) =>
        this.http
            .get<BaseResponse<NotificationChannels>>(
                `${this.url}/${projectId}/category/shop/${shopId}/notification-config`,
            )
            .then(resp => notificationConfigAdapter(resp.data.response));

    public readonly getNotificationConfig = (id: number) =>
        this.http
            .get<BaseResponse<NotificationChannels>>(`${this.url}/${id}/notification-config`)
            .then(resp => notificationConfigAdapter(resp.data.response));

    public readonly sendUpdatedActToShop = (taskId: number) =>
        this.http
            .post<BaseResponse<null>>(`${this.url}/task/${taskId}/act/send-updated-act-to-shop`, {})
            .then(resp => resp.data.response);
}

export default new CleaningProjectService();
