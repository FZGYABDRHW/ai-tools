import BaseService from '../BaseServiceV4';
import { AxiosRequestConfig } from 'axios';
import { BaseResponse } from '../../interfaces';
import {
    Equipment,
    EquipmentType,
    Manufacturer,
    EquipmentCreate,
    EquipmentListParams,
    ManufacturerCreate,
    EquipmentTypeCreate,
    EquipmentParams,
    FilesResponse,
    List,
    MaintenanceHistoryParams,
} from './interfaces';
import { IncidentList } from '../incident/interface';

export class EquipmentService extends BaseService {
    private readonly url: string = `${this.baseUrl}/equipment`;

    public readonly remove = (id: number) =>
        this.http.delete(`${this.url}/${id}`).then(resp => resp.data.response);

    public readonly getEquipmentList = (
        params?: EquipmentListParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<List<Equipment>>>(`${this.url}`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getEquipment = (
        id: number,
        params?: EquipmentParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Equipment>>(`${this.url}/${id}`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getEquipmentFiles = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<FilesResponse>>(`${this.url}/${id}/files`, options)
            .then(resp => resp.data.response);

    public readonly createEquipment = (data: EquipmentCreate, options?: AxiosRequestConfig) =>
        this.http
            .post<BaseResponse<Equipment>>(`${this.url}`, data, options)
            .then(resp => resp.data.response);

    public readonly edit = (id: number, data: EquipmentCreate, options?: AxiosRequestConfig) =>
        this.http
            .put<BaseResponse<Equipment>>(`${this.url}/${id}`, data, options)
            .then(resp => resp.data.response);

    public readonly getManufacturers = () =>
        this.http
            .get<BaseResponse<Manufacturer[]>>(`${this.url}/manufacturer`)
            .then(resp => resp.data.response);

    public readonly createManufacturer = (data: ManufacturerCreate) =>
        this.http
            .post<BaseResponse<Manufacturer>>(`${this.url}/manufacturer`, data)
            .then(resp => resp.data.response);

    public readonly getCategories = () =>
        this.http
            .get<BaseResponse<string[]>>(`${this.url}/category`)
            .then(resp => resp.data.response);

    public readonly getManufacturer = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Manufacturer>>(`${this.url}/manufacturer/${id}`, options)
            .then(resp => resp.data.response);

    public readonly getTypes = () =>
        this.http
            .get<BaseResponse<EquipmentType[]>>(`${this.url}/type`)
            .then(resp => resp.data.response);

    public readonly createType = (data: EquipmentTypeCreate) =>
        this.http
            .post<BaseResponse<EquipmentType>>(`${this.url}/type`, data)
            .then(resp => resp.data.response);

    public readonly getType = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<EquipmentType>>(`${this.url}/type/${id}`, options)
            .then(resp => resp.data.response);

    public readonly getMaintenanceHistory = (
        id: number,
        params?: MaintenanceHistoryParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<IncidentList>>(`${this.url}/${id}/incidents`, { params, ...options })
            .then(resp => resp.data.response);
}

export default new EquipmentService();
