import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import {
    ContactPhone,
    CreateContactPhone,
    Entity,
    ContactPhonesByEntity,
    ContactPhones,
} from './interfaces';

export class ContactPhoneService extends BaseService {
    private readonly url: string = `${this.baseUrl}/contact-phone`;

    public readonly getContactPhones = (
        entity: Entity,
        entityId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<ContactPhones>>(`${this.url}/${entity}/${entityId}`, options)
            .then(resp => resp.data.response);

    public readonly createContactPhones = (
        shopId: number,
        phone: CreateContactPhone,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<null>>(`${this.url}/shop/${shopId}`, phone, options)
            .then(resp => resp.data.response);

    public readonly createContactPhonesByEntity = (
        entity: Entity,
        entityId: number,
        phone: CreateContactPhone,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<ContactPhonesByEntity>>(
                `${this.url}/${entity}/${entityId}`,
                phone,
                options,
            )
            .then(resp => resp.data.response);

    public readonly updateContactPhones = (phone: ContactPhone, options?: AxiosRequestConfig) =>
        this.http
            .patch<BaseResponse<ContactPhone>>(`${this.url}/${phone.id}`, phone, options)
            .then(resp => resp.data.response);

    public readonly deleteContactPhones = (id: number, options?: AxiosRequestConfig) =>
        this.http.delete(`${this.url}/${id}`, options).then(resp => resp.data.response);
}
