import { AxiosRequestConfig } from 'axios';
import BaseService from '../BaseServiceV2';
import { BaseResponse } from '../../interfaces';
import { Region, IService, Pricelist } from './calculate.interfaces';

class CalculatedRegionService extends BaseService {
    async getRegions(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Region[]>>(
            `${this.baseUrl}/site/calculator-regions`,
            options,
        );
        return response;
    }

    async getCalculatorPrice(options?: AxiosRequestConfig) {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<Pricelist>>(
            `${this.baseUrl}/site/calculator`,
            options,
        );
        return response;
    }
}

export { CalculatedRegionService, Region, IService };

export default new CalculatedRegionService();
