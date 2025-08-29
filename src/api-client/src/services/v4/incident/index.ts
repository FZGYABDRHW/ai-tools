import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import {
    IncidentQuery,
    IncidentList,
    EntityIncidentLinkQuery,
    EntityIncidentLinkList,
    Incident,
    UpdateIncident,
    CreateIncident,
    IncidentAttachmentList,
    IncidentEventsList,
    LinkAttachment,
    IncidentTaskStatus,
    AssignResponsiblePerson,
    AssignContractorIncident,
    AssignedContractorCompany,
    DownloadAttachment,
    IncidentWithAdditionalInfo,
    IncidentListWithAdditionalInfo,
    StepIncidentParams,
    PostCommentParams,
    EventListParams,
    IncidentCommentariesUnreadCounterInfo,
    IncidentListWithEventsCount,
    LogsParams,
    LogList,
    CreateCategory,
    EditCategory,
    CategoryListParams,
    IncidentCategoryList,
    CreateRouteParams,
    GetIncidentRouteListParams,
    IncidentRouteList,
    Category,
    IncidentControls,
    RefuseIncident,
} from './interface';
import { AxiosRequestConfig } from 'axios';
import { ContractorCompany } from '../organization/contractor-company/interfaces';

export enum TypeStatusIncident {
    NEW = 'new',
    IN_WORK = 'inWork',
    CLOSED = 'closed',
    CANCELLED = 'cancelled',
    ON_CONFIRMATION = 'completed',
}

type ComposeIncidentAndAdditionalInfo = (
    incident: Incident,
    additionalInfo: [
        ContractorCompany | undefined,
        IncidentCommentariesUnreadCounterInfo | undefined
    ],
) => IncidentWithAdditionalInfo;

type ComposeIncidentAndEventsCount = (
    incident: Incident,
    additionalInfo: IncidentCommentariesUnreadCounterInfo | undefined,
) => IncidentWithAdditionalInfo;

const composeIncidentAndAdditionalInfo: ComposeIncidentAndAdditionalInfo = (
    incident,
    [contractorCompany, commentariesUnreadCounterInfo],
) => ({
    ...incident,
    contractorCompany,
    commentariesUnreadCounterInfo,
});

const composeIncidentAndEventsCount: ComposeIncidentAndEventsCount = (
    incident,
    commentariesUnreadCounterInfo,
) => ({
    ...incident,
    commentariesUnreadCounterInfo,
});

export class IncidentService extends BaseService {
    private readonly url: string = `${this.baseUrl}/incident`;
    private readonly urlRoute: string = `${this.url}/category/route/shop`;

    public readonly setStepIncident = (incidentId, params: StepIncidentParams) =>
        this.http
            .patch(`${this.url}/${incidentId}/set-step`, params)
            .then(resp => resp.data.response);

    public readonly createRoute = (data: CreateRouteParams) =>
        this.http.post(this.urlRoute, data).then(resp => resp.data.response);

    public readonly getRoutes = (params: GetIncidentRouteListParams) =>
        this.http
            .get<BaseResponse<IncidentRouteList>>(this.urlRoute, { params })
            .then(resp => resp.data.response);

    public readonly getCategories = (params?: CategoryListParams) =>
        this.http
            .get<BaseResponse<IncidentCategoryList>>(`${this.url}/categories`, { params })
            .then(resp => resp.data.response);

    public readonly getControls = (incidentId: number) =>
        this.http
            .get<BaseResponse<IncidentControls>>(`${this.url}/${incidentId}/controls`)
            .then(resp => resp.data.response);

    public readonly getCategory = (id: number) =>
        this.http
            .get<BaseResponse<Category>>(`${this.url}/category/${id}`)
            .then(resp => resp.data.response);

    readonly deleteCategory = (id: number, options?: AxiosRequestConfig) =>
        this.http.delete(`${this.url}/category/${id}`, options).then(resp => resp.data.response);

    public readonly createCategory = ({ name, organization_id }: CreateCategory) =>
        this.http
            .post(`${this.url}/category`, { name, organization_id })
            .then(resp => resp.data.response);

    public readonly editCategory = ({ name, id }: EditCategory) =>
        this.http.put(`${this.url}/category`, { name, id }).then(resp => resp.data.response);

    readonly editCategoryName = ({ id, name }: EditCategory) =>
        this.http.patch(`${this.url}/category/${id}`, { name }).then(resp => resp.data.response);

    public readonly assignContractorCompany = ({
        contractor_company_id,
        incident_id,
    }: AssignContractorIncident) =>
        this.http
            .post(`${this.url}/${incident_id}/assign-contractor-company`, { contractor_company_id })
            .then(resp => resp.data.response);

    public readonly refuseIncident = (incidentId: number, params: RefuseIncident) =>
        this.http.post(`${this.url}/${incidentId}/refuse`, params).then(resp => resp.data.response);

    public readonly cancelIncident = (incidentId: number) =>
        this.http.patch(`${this.url}/${incidentId}/cancel`).then(resp => resp.data.response);

    public readonly assignedContractorCompany = (incident_id: number) =>
        this.http
            .get<BaseResponse<AssignedContractorCompany>>(
                `${this.url}/${incident_id}/contractor-company`,
            )
            .then(resp => resp.data.response);

    public readonly downloadAttachment = (params: DownloadAttachment): string => {
        const absoluteUrl: string = `${this.http.config.baseURL}${this.url}`;
        return `${absoluteUrl}/${params.incidentId}/attachment/${
            params.attachmentId
        }/download?&access-token=${params.token}`;
    };

    readonly getList = (params?: Partial<IncidentQuery>, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IncidentList>>(`${this.url}`, { params, ...options })
            .then(resp => resp.data.response);

    readonly getListWithEventsCount: (
        params: Partial<IncidentQuery>,
    ) => Promise<IncidentListWithEventsCount> = params =>
        this.getList(params).then(({ items, totalCount }) =>
            Promise.all(
                items.map(incident =>
                    this.getCommentariesUnreadCounterInfo(incident.id)
                        .catch(() => void 0)
                        .then(commentariesUnreadCounterInfo =>
                            composeIncidentAndEventsCount(incident, commentariesUnreadCounterInfo),
                        ),
                ),
            ).then(newItems => ({ totalCount, items: newItems })),
        );

    readonly getEntityIncidentLinkList = (
        params?: EntityIncidentLinkQuery,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<EntityIncidentLinkList>>(`${this.url}/entity-link`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    readonly createIncident = (data: CreateIncident, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<Incident>>(`${this.url}`, data, options)
            .then(resp => resp.data.response);

    readonly createEntityIncidentLinkList = (
        id: number,
        params?: EntityIncidentLinkQuery,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<void>>(`${this.url}/${id}/entity-link`, params, options)
            .then(resp => resp.data.response);

    readonly deleteEntityIncidentLink = (entityLinkId: number, options?: AxiosRequestConfig) =>
        this.http
            .delete(`${this.url}/entity-link/${entityLinkId}`, options)
            .then(resp => resp.data.response);

    readonly getIncident = (incidentId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Incident>>(`${this.url}/${incidentId}`)
            .then(resp => resp.data.response);

    readonly getStatusDetailsIncident = (incidentId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IncidentTaskStatus[]>>(
                `${this.url}/${incidentId}/status-details`,
                options,
            )
            .then(resp => resp.data.response);

    readonly updateIncident = (
        incidentId: number,
        params?: UpdateIncident,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .patch<BaseResponse<void>>(`${this.url}/${incidentId}`, params, options)
            .then(resp => resp.data.response);

    readonly updateEntityIncidentLink = (
        entityLinkId: number,
        params?: { incidentId?: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .put(`${this.url}/entity-link/${entityLinkId}`, params, options)
            .then(resp => resp.data.response);

    readonly getAttachmentsList = (incidentId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<IncidentAttachmentList>>(
                `${this.url}/${incidentId}/attachments`,
                options,
            )
            .then(resp => resp.data.response);

    readonly getEventsList = (
        incidentId: number,
        params: EventListParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<IncidentEventsList>>(`${this.url}/${incidentId}/comments`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    readonly createLinkAttachment = (
        id: number,
        params: LinkAttachment,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<void>>(`${this.url}/${id}/attachment`, params, options)
            .then(resp => resp.data.response);

    readonly linkLocation = (incidentId: number) =>
        this.http
            .patch<BaseResponse<Incident>>(`${this.url}/${incidentId}/link-location`)
            .then(resp => resp.data.response);

    readonly getResponsiblePerson = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Incident>>(`${this.url}/${id}/responsible-user`, options)
            .then(resp => resp.data.response);

    readonly assignResponsiblePerson = (
        id: number,
        params?: AssignResponsiblePerson,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<void>>(`${this.url}/${id}/assign-responsible-user`, params, options)
            .then(resp => resp.data.response);

    readonly postComment = (
        incidentId: number,
        params?: PostCommentParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<void>>(`${this.url}/${incidentId}/comment`, params, options)
            .then(resp => resp.data.response);

    readonly getContractorCompany: (
        incidentId: number,
    ) => Promise<ContractorCompany | undefined> = incidentId =>
        this.http
            .get<BaseResponse<ContractorCompany>>(
                `${this.url}/${incidentId}/contractor-company`,
                {},
            )
            .then(resp => resp.data.response || void 0);

    readonly getCommentariesUnreadCounterInfo: (
        incidentId: number,
    ) => Promise<IncidentCommentariesUnreadCounterInfo | undefined> = incidentId =>
        this.http
            .get<BaseResponse<number | undefined>>(
                `${this.url}/${incidentId}/comments/unread-count`,
                {},
            )
            .then(resp => resp.data.response || void 0)
            .then(count => {
                if (count) {
                    return { count };
                } else {
                    return void 0;
                }
            });

    readonly getListWithAdditionalInfo: (
        params: Partial<IncidentQuery>,
    ) => Promise<IncidentListWithAdditionalInfo> = params =>
        this.getList(params).then(({ items, totalCount }) =>
            Promise.all(
                items.map(incident =>
                    Promise.all([
                        this.getContractorCompany(incident.id).catch(() => void 0),
                        this.getCommentariesUnreadCounterInfo(incident.id).catch(() => void 0),
                    ]).then(additionalInfo =>
                        composeIncidentAndAdditionalInfo(incident, additionalInfo),
                    ),
                ),
            ).then(newItems => ({ totalCount, items: newItems })),
        );

    readonly markCommentsAsRead: (incidentId: number) => Promise<null> = (incidentId: number) =>
        this.http
            .patch<BaseResponse<null>>(`${this.url}/${incidentId}/comments/read`)
            .then(resp => resp.data.response);

    readonly getLogs = (incidentId: number, params: LogsParams, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<LogList>>(`${this.url}/${incidentId}/log`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);
}
