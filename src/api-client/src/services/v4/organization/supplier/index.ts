import BaseService from '../../BaseServiceV4';
import { BaseResponse } from '../../../interfaces';
export interface CountryList {
    items: any;
}

export class SupplierService extends BaseService {
    private readonly url: string = `${this.baseUrl}/organization/supplier`;

    public readonly getCountryList = () =>
        this.http.get<BaseResponse<CountryList>>(`${this.url}/countries`).then(resp => {
            return resp.data.response.items;
        });
}

export default new SupplierService();
