import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';
import BaseService from '../../BaseServiceV1';
import {
    Performer,
    PerformerSkills,
    PerformerTools,
    Regions,
    PerformerPassport,
    StatusFavorite,
} from './interfaces';

export class PerformerService extends BaseService {
    private url = `${this.baseUrl}/organization/performer`;

    async getPerformerInfo(performerID, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Performer>>(`${this.url}/${performerID}`, options);
        return response;
    }

    async getPerformerTools(performerID, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<PerformerTools[]>>(
            `${this.url}/${performerID}/tools`,
            options,
        );
        return response;
    }

    async getPerformerSkills(performerID, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<PerformerSkills>>(
            `${this.url}/${performerID}/skills`,
            options,
        );
        return response;
    }

    async getPerformerRegions(performerID, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Regions[]>>(
            `${this.url}/${performerID}/regions`,
            options,
        );
        return response;
    }

    async getPerformerPassport(performerID, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<PerformerPassport>>(
            `${this.url}/${performerID}/passport`,
            options,
        );
        return response;
    }

    async getStatusFavorite(performerID, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<StatusFavorite>>(
            `${this.url}/${performerID}/favorite`,
            options,
        );
        return response;
    }

    async setStatusFavorite(performerID, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.post<BaseResponse<StatusFavorite>>(
            `${this.url}/${performerID}/favorite`,
            {},
            options,
        );
        return response;
    }

    async deleteStatusFavorite(performerID, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.delete(`${this.url}/${performerID}/favorite`, options);
        return response;
    }
}

export default new PerformerService();
