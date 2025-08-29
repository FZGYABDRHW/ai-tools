import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';

export interface IResponseGetLits {
    id: number;
    user_id: number;
    alert_id: number;
    create_date: string;
    show_date: string;
    user_viewed: boolean;
    user_clicked: boolean;
    user_closed: boolean;
    alert: {
        id: number;
        title: string;
        text: string;
        type: number;
        freq_type: number;
        color: string;
        duration: number;
        visually_closable: boolean;
        button: {
            text: string;
            link: string;
        };
    };
}

export class AlertsServise extends BaseService {
    async getList() {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<IResponseGetLits[]>>(
            `${this.baseUrl}/common/alerts-user/list`,
        );
        return response;
    }

    async shows(id) {
        const {
            data: { response },
        } = await this.http.post<BaseResponse<null>>(`${this.baseUrl}/common/alerts-user/show`, {
            id: id,
        });
    }

    async closed(id) {
        const {
            data: { response },
        } = await this.http.post<BaseResponse<null>>(`${this.baseUrl}/common/alerts-user/close`, {
            id: id,
        });
    }

    async submit(id) {
        const {
            data: { response },
        } = await this.http.post<BaseResponse<null>>(`${this.baseUrl}/common/alerts-user/click`, {
            id: id,
        });
    }
}

export default new AlertsServise();
