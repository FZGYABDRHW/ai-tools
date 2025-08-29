import { BaseResponse } from '../../../interfaces';
import BaseService from '../../BaseServiceV1';
import { GetMinimalPriceParams, MinimalPrice } from './interfaces';

export class OrganizationContractService extends BaseService {
    private readonly url: string = `${this.baseUrl}/organization/contract`;

    getMinimalPrice = async (id: number, params: GetMinimalPriceParams) => {
        return this.http
            .get<BaseResponse<MinimalPrice>>(`${this.url}/${id}/minimal-price`, { params })
            .then(resp => resp.data.response);
    };
}

export default new OrganizationContractService();
