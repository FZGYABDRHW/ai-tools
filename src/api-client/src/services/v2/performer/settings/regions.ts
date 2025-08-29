import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import {
    IResponseGetUserLocation,
    IResponseGetRegionList,
    ISearchRegions,
    ISearchLocation,
    IResponseGetUserLocationRegistration,
} from './interfaces';
import { RegionType } from '../../curator/performer/interfaces';
import { AxiosRequestConfig } from 'axios';

class RegionService extends BaseService {
    private url = `${this.baseUrl}/performer/settings/regions`;

    async getUserLocation(params: { lat: number; lon: number }, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<IResponseGetUserLocation[]>>(`${this.url}/location`, {
            params: params,
            ...options,
        });
        return response;
    }

    async getUserRegionList(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<IResponseGetRegionList>>(this.url, options);
        return response;
    }

    async getBigCity(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<IResponseGetRegionList>>(
            `${this.url}/in-big-city`,
            options,
        );
        return response;
    }

    async deleteRegionById(id: number, options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.delete(this.url, { params: { regionId: id }, ...options });
        return response;
    }

    async searchRegions(params: { address: string; limit?: number }, options?: AxiosRequestConfig) {
        const {
            data: {
                response: { regions },
            },
        } = await this.http.get<BaseResponse<ISearchRegions>>(`${this.url}/search`, {
            params: params,
            ...options,
        });
        return regions;
    }

    async addUserPolygon(
        params: { regionId: number; type: RegionType },
        options?: AxiosRequestConfig,
    ) {
        await this.http.post<BaseResponse<{ maxRegions: number }>>(this.url, params, options);
    }

    async searchRegistrationRegions(
        params: { address: string; limit: number },
        options?: AxiosRequestConfig,
    ) {
        const url = `${this.baseUrl}/performer/settings/intro-questionnaire/search-region`;
        const {
            data: {
                response: { regions },
            },
        } = await this.http.get<BaseResponse<ISearchRegions>>(url, { params: params, ...options });
        return regions;
    }

    async getUserLocationRegistration(
        params: { lat: number; lon: number },
        options?: AxiosRequestConfig,
    ) {
        const url = `${this.baseUrl}/performer/settings/intro-questionnaire/location`;
        const {
            data: { response },
        } = await this.http.get<BaseResponse<IResponseGetUserLocationRegistration>>(url, {
            params: params,
            ...options,
        });
        return response;
    }
}

export { RegionService };

export default new RegionService();
