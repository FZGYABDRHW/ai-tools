import BaseService from '../../../BaseServiceV4';
import { BaseResponse } from '../../../../interfaces';

export class TemplateScheduleService extends BaseService {
    private readonly url: string = `${this.baseUrl}/incident/template/schedule`;

    readonly deleteSchedule = (id: number) =>
        this.http.delete(`${this.url}/${id}`).then<BaseResponse<null>>(resp => resp.data.response);
}
