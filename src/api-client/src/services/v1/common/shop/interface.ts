import { File } from '../../organization/task/interfaces';
import { WorkTime } from '../../organization/shop/interfaces';
import { ShopBranch } from '../../../v2/curator/tools/shop/interfaces';

export interface CreateSettings {
    availableProperties: {
        file_id: number;
        id: number;
        key: string;
        label: string;
    }[];
    fromTask: boolean;
    mapAddress: string;
    mapCenter: string[];
    shop_fields: boolean;
    uploadConfig: {
        files: File[];
        modelId: number;
        type: number;
    };
}

export interface Suborganization {
    id: number;
    juridical_address: string;
    name: string;
    requisites: {
        bank: string;
        bik: string;
        checking_account: string;
        correspondent_account: string;
        inn: string;
        kpp: string;
    };
}

export interface ShopInfoBase {
    address_name: string;
    address_original: string;
    address_point: string[];
    contact_mail: string;
    contact_name: string;
    contact_phone: number;
    contact_phone_additional?: number;
    description: string;
    id?: number;
    lamps?: string;
    name: string;
    paints?: string;
    pass?: boolean;
    show_fields?: boolean;
    stairs?: boolean;
    shop_branch?: ShopBranch;
    stairs_less_three?: boolean;
    suborganization_id: number;
    suborganization_name?: string;
    area_size?: string;
    adjoined_area_size?: number;
    kpp?: string;
    client_shop_id?: string;
}

export interface ShopInfo extends ShopInfoBase {
    files: ReadonlyArray<number>;
    mode_time: {
        weekdays: WorkTime;
        weekend: WorkTime;
    };
}

export interface ShopInfoRequest extends ShopInfoBase {
    mode_time: string;
    files: ReadonlyArray<number>;
}
export enum ActionMethod {
    CLEANING_RESULT_REPORT = 'actionCleaningResultReport',
    CLEANING_ACT = 'actionCleaningAct',
    RATING = 'actionRating',
    NOT_DONE = 'actionNotDone',
}

export interface ShopLoginParams {
    key: string;
    actionMethod: ActionMethod;
}

export interface ShopLoginToken {
    token: string;
}
