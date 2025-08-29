import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import { Md5 } from 'ts-md5/dist/md5';
import {
    IResponseGetUserAvatar,
    IPassword,
    IAccount,
    IResponseGetStepsStatus,
    IRequestRegistration,
    IResponseRegistration,
} from './interfaces';
import { ContactsService } from './contacts';
import { IndividualEntrepreneurService } from './individual-entrepreneur';
import { NotificationsService } from './notifications';
import { PassportService } from './passport';
import { PersonalService } from './personal';
import { RegionService } from './regions';
import { PerformerSkillsService } from './skills';
import { TelegramService } from './telegram';
import { PerformerToolsService } from './tools';
import { AxiosRequestConfig } from 'axios';

export default class SettingsBaseService extends BaseService {
    async getUserAvatar(options?: AxiosRequestConfig) {
        const url = `${this.baseUrl}/performer/settings/avatar`;
        const {
            data: { response },
        } = await this.http.get<BaseResponse<IResponseGetUserAvatar>>(url, options);
        return response;
    }

    async changePassword(
        oldPassword: string,
        newPassword: string,
        newPasswordRepeat: string,
        options?: AxiosRequestConfig,
    ) {
        const params = {
            old_password: Md5.hashStr(oldPassword),
            new_password: Md5.hashStr(newPassword),
            new_password_repeat: Md5.hashStr(newPasswordRepeat),
        };
        const url = `${this.baseUrl}/performer/settings/password`;
        const {
            data: { status },
        } = await this.http.post<BaseResponse<IPassword>>(url, params, options);
        return status;
    }

    async removeAccount(accept: boolean, options?: AxiosRequestConfig) {
        const url = `${this.baseUrl}/performer/settings/account`;
        const {
            data: { response },
        } = await this.http.delete(url, { params: { accepted: accept }, ...options });
        return response;
    }

    async getStepsStatus(options?: AxiosRequestConfig) {
        const url = `${this.baseUrl}/performer/settings/validation`;
        const {
            data: { response },
        } = await this.http.get<BaseResponse<IResponseGetStepsStatus>>(url, options);
        return response;
    }

    async registration(params: IRequestRegistration, options?: AxiosRequestConfig) {
        const url = `${this.baseUrl}/performer/settings/intro-questionnaire`;
        const { data } = await this.http.post<BaseResponse<IResponseRegistration>>(
            url,
            params,
            options,
        );
        return data;
    }
}

export {
    SettingsBaseService,
    ContactsService,
    IndividualEntrepreneurService,
    NotificationsService,
    PassportService,
    PersonalService,
    RegionService,
    PerformerSkillsService,
    TelegramService,
    PerformerToolsService,
};
