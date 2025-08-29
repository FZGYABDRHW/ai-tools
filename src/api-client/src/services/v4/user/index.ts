import BaseService from '../BaseServiceV4';
import { BaseResponse, CurrencyCodes } from '../../interfaces';
import {
    User,
    UserOrganization,
    UserAnnotations,
    PerformerProfile,
    Department,
    LastCalledNumber,
    SelfEmloyed,
    BindSelfEmployedInfo,
    BindStep,
    LoginByEmailParams,
    ResponsibleUsersParams,
    ResponsibleUser,
    JWT,
    GetListUserParams,
} from './interfaces';
import { List } from '../organization/interfaces';
import { AxiosRequestConfig } from 'axios';

export class UserService extends BaseService {
    private readonly url: string = `${this.baseUrl}/user`;

    readonly login = (phone: string, password: string) =>
        this.http
            .post<BaseResponse<{ id: number; token: string }>>(`${this.url}/login`, {
                phone,
                password,
            })
            .then(r => r.data);

    readonly checkToken = (token: string) =>
        this.http
            .post<BaseResponse<{ id: number; token: string }>>(`${this.url}/login/token`, { token })
            .then(r => r.data)
            .catch(r => r.response.data);

    readonly loginByEmail = ({ email, portal }: LoginByEmailParams) =>
        this.http
            .post<BaseResponse<null>>(`${this.url}/login/send-link`, {
                email,
                portal,
            })
            .then(r => r.data)
            .catch(r => r.response.data);

    readonly get = (id: number, options?: AxiosRequestConfig) =>
        this.http.get<BaseResponse<User>>(`${this.url}/${id}`, options).then(resp => resp.data);

    readonly getOrganizationUsersByRole = (
        role: string,
        organizationId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<List<User>>>(
                `${this.url}?roleName=${role}&organizationId=${organizationId}`,
                options,
            )
            .then(resp => resp.data.response);

    readonly getList = (ids: number[], options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<{ items: User[] }>>(`${this.url}`, {
                params: { ids: ids.join(',') },
                ...options,
            })
            .then(resp => resp.data);

    readonly getListUser = (params: GetListUserParams) =>
        this.http
            .get<BaseResponse<{ items: User[] }>>(`${this.url}`, { params })
            .then(resp => resp.data.response);

    readonly getUserOrganization = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<UserOrganization>>(`${this.url}/${id}/organization`, options)
            .then(resp => resp.data.response);

    readonly getResponsibleUsers = (
        organizationId: number,
        params?: ResponsibleUsersParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<List<ResponsibleUser>>>(
                `${this.url}/organization/${organizationId}/responsible-users`,
                { params, ...options },
            )
            .then(resp => resp.data.response);

    public readonly getPerformer = (performerId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Partial<PerformerProfile>>>(
                `${this.url}/${performerId}/performer`,
                options,
            )
            .then(resp => resp.data);

    public readonly getAnnotations = (
        userId: number,
        params?: { limit: number; offset: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<UserAnnotations>>(`${this.url}/${userId}/annotation`, options)
            .then(resp => resp.data);

    public readonly rejectPayment = (
        userId: number,
        walletLogId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<null>>(
                `${this.url}/${userId}/performer/wallet/payment/${walletLogId}/reject`,
                {},
                options,
            )
            .then(resp => resp.data.response);

    public readonly startBindSelfEmployed = (userId: number, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<BindSelfEmployedInfo>>(
                `${this.url}/${userId}/performer/self-employed/start-bind`,
                {},
                options,
            )
            .then(resp => resp.data.response);

    public readonly revokeSelfEmloyed = async (userId: number, options?: AxiosRequestConfig) =>
        this.http
            .patch<BaseResponse<void>>(`${this.url}/${userId}/performer/self-employed/revoke`)
            .then(resp => resp.data.response);

    public readonly statusBindSelfEmployed = (
        userId: number,
        params?: BindStep,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<BindSelfEmployedInfo>>(
                `${this.url}/${userId}/performer/self-employed/bind-step`,
                { params, ...options },
            )
            .then(resp => resp.data.response);

    public readonly getDepartmentsList = (userId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<{ items: Array<Department> }>>(
                `${this.url}/${userId}/organization/department`,
                options,
            )
            .then(resp => resp.data.response);

    public readonly getLastCalledPhoneNumber = (userId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<LastCalledNumber>>(`${this.url}/${userId}/hunter/last-call`, options)
            .then(resp => resp.data.response);

    public readonly revokeIEStatus = async (contractorId: number, options?: AxiosRequestConfig) =>
        this.http
            .patch<BaseResponse<void>>(
                `${this.url}/${contractorId}/performer/individual-entrepreneur/revoke`,
            )
            .then(resp => resp.data.response);

    public readonly contractorSelfEmployedProfile = (
        contractorId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<SelfEmloyed>>(
                `${this.url}/${contractorId}/performer/self-employed`,
                options,
            )
            .then(resp => resp.data.response);

    public readonly createJWT = <T>(dataToEncrypt: T, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<JWT>>(
                `${this.url}/jwt`,
                {
                    claims: {
                        payload: dataToEncrypt,
                    },
                },
                options,
            )
            .then(resp => resp.data.response);
}

export default new UserService();
