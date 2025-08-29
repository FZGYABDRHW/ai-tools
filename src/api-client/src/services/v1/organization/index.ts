import BaseService from '../BaseServiceV1';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { Departments, EditProfile, Employee, Branch, Suborganization } from './interfaces';

export default class OrganizationService extends BaseService {
    private readonly url: string = `${this.baseUrl}/organization`;

    getEmploeeProfile = async (options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<Employee>>(`${this.url}/employee/profile`, options)
            .then(resp => resp.data.response);

    updateEmployeeProfile = async (params: EditProfile, options?: AxiosRequestConfig) =>
        await this.http
            .post<BaseResponse<any>>(`${this.url}/employee/profile/update`, params, options)
            .then(resp => resp.data.messages);

    getDepartmentsList = async (options?: AxiosRequestConfig) =>
        await this.http
            .get<BaseResponse<Departments>>(`${this.url}/department`, options)
            .then(resp => resp.data.response);

    getOrganizationBranch = (options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<ReadonlyArray<Branch>>>(`${this.url}/branch`, options)
            .then(({ data: { response } }) => response);

    getSuborganizationList = (params?: { isBlocked?: boolean }, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<ReadonlyArray<Suborganization>>>(`${this.url}/suborganization`, {
                params,
                ...options,
            })
            .then(({ data: { response } }) => response);
}
