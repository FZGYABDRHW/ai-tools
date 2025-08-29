import BaseService from '../BaseServiceV1';
import { BaseResponse } from '../../interfaces';
import { ShopList, ShopListParams } from './interfaces';

export class ContractorCompanyService extends BaseService {
    private readonly url: string = `${this.baseUrl}/contractor-company`;

    getShopList = (params: ShopListParams) =>
        this.http
            .get<BaseResponse<ShopList>>(`${this.url}/shops`, {
                params,
            })
            .then(r => r.data.response);
}

export default new ContractorCompanyService();
