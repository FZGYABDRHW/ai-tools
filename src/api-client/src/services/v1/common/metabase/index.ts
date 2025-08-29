import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { Dashboard } from './interfaces/dashboard';
import { Card, CardParams } from './interfaces/card';

export class MetabaseService extends BaseService {
    private readonly url = `${this.baseUrl}/common/metabase`;

    public getDashboard = async (id: number) =>
        await this.http
            .get<BaseResponse<Dashboard>>(`${this.url}/dashboard/${id}`)
            .then(resp => resp.data.response);

    public getCard = async (id: number, parameters?: CardParams) =>
        await this.http
            .post<BaseResponse<Card>>(`${this.url}/card/${id}`, parameters)
            .then(resp => resp.data.response);
}

export default new MetabaseService();
