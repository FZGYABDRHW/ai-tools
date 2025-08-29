import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';
import { AxiosRequestConfig } from 'axios';

class PerformerQuestionnaireService extends BaseService {
    private readonly url: string = `${this.baseUrl}/curator/shop`;

    public readonly getPerformerQuestionnaire = (shopId, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<any>>(`${this.url}/${shopId}/questionnaire`, options)
            .then(resp => resp.data);
}

export { PerformerQuestionnaireService };

export default new PerformerQuestionnaireService();
