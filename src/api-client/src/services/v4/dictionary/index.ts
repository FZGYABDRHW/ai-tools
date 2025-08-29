import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { DictionaryKeyType, DictionaryList } from './interfaces';

export class DictionaryService extends BaseService {
    private readonly url: string = `${this.baseUrl}/dictionary`;

    public readonly getList = (key: DictionaryKeyType) =>
        this.http
            .get<BaseResponse<DictionaryList>>(`${this.url}/${key}`)
            .then(resp => resp.data.response);
}

export default new DictionaryService();
