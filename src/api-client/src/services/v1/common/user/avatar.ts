import BaseService from '../../BaseServiceV1';
import { BaseResponse } from '../../../interfaces';

export interface IResponseGetAvatar {
    modelId: number;
    type: number;
    userImg: {
        url: string;
        id: number;
    };
}

export class AvatarService extends BaseService {
    private url: string = `${this.baseUrl}/common/user/get-avatar-upload-config`;

    async getUserAvatar() {
        const {
            data: { response },
        } = await this.http.get<BaseResponse<IResponseGetAvatar>>(this.url);
        return response;
    }
}

export default new AvatarService();
