import { PerformerInvoicingModes } from '../../../interfaces';

export interface ITool {
    id: number;
    name: string;
    description: string;
    owned: boolean;
    default?: boolean;
}

export interface IResponseGetUserAvatar {
    modelId: number;
    type: number;
    photo_id: number;
}

export interface IContacts {
    email: string;
    phone: IPhone;
    phone_additional: IPhoneAdditional;
}

export interface IPhone {
    accepted: boolean;
    number: string;
}

export interface IPhoneAdditional {
    accepted: boolean;
    number: string;
}

export interface IResponseGetIEData {
    user_id: number;
    inn: string;
    checking_account: string;
    bik: string;
    bank_name: string;
    agreement: boolean;
    registration_address: string;
    refused: boolean;
    refuseReason: string;
    filledPassport: boolean;
    uploadConfig: {
        modelId: number;
        type: number;
        allowDeletion: number;
    };
    files: {
        id: number;
        mime: string;
        url: string;
        display_name: string;
        size: string;
    };
    IEValidation: boolean;
    IERequested: boolean;
    zip: string;
    city: string;
    national_number: string;
    vat_surcharge: boolean;
    invoicing_mode: PerformerInvoicingModes;
}

export interface IRequestSetIEData {
    inn: string;
    checking_account: string;
    bik: string;
    bank_name?: string;
    agreement?: boolean;
    registration_address?: string;
    zip?: string;
    city?: string;
    national_number?: string;
    vat_surcharge?: boolean;
    invoicing_mode?: PerformerInvoicingModes;
}

export interface INotifications {
    user_id: number;
    sms: number;
    email: number;
    android: number;
    telegram: number;
    ios: number;
    night: number;
    night_from: string;
    night_to: string;
    weekend: number;
    departments: number;
    weekday: number;
}

export interface IResponseGetUserPassportInfo {
    numberAndSeries: string;
    whenIssued: string;
    issuedBy: string;
    files: {
        id: number;
        mime: string;
        url: string;
        display_name: string;
        size: number;
    }[];
    uploadConfig: {
        modelId: number;
        type: number;
    };
    status: number;
    status_alias: string;
    reason: string;
}

export interface IPassword {
    old_password: string;
    new_password: string;
    new_password_repeat: string;
}

export interface UserInfoStore {
    firstName?: string;
    secondName?: string;
    thirdName?: string;
    birthday?: string;
}

export interface ILocation {
    id: number;
    name?: string;
}

export interface ISearchLocation extends ILocation {
    children?: ISearchChildLocation[];
    availableCallTime?: Range;
    name_geocoded?: string;
}

export interface ISearchChildLocation extends ILocation {
    hint: string[];
    checked?: boolean;
}

export interface IResponseGetUserLocation extends ILocation {
    maxAdditionalRegions: number;
}

export interface IResponseGetUserLocationRegistration extends IResponseGetUserLocation {
    availableCallTime: Range;
}

export interface IResponseGetRegionList {
    main: ISearchLocation[];
    additional: ISearchLocation[];
    maxAdditionalRegions: number;
    canChangeMainRegion: boolean;
}

export interface ISearchRegions {
    regions: ISearchLocation[];
}

export interface IAccount {
    accepted: boolean;
}

export interface ISkillStatus {
    status: number;
    status_alias: string;
}

export interface ISkill {
    id: number;
    name: string;
    description: string;
    status: ISkillStatus;
    tools: ITool[];
    files: File[];
    fileManagerConfig: {
        modelId: number;
        type: number;
        text: string;
    } | null;
    fileAttachConfig: {
        required: string;
        failed: string;
    };
}

export interface ISkillsGroup {
    name: string;
    skills: ISkill[];
}

export interface ITelegram {
    bot_name: string;
    connected: boolean;
    url: string;
    wording: string;
}

export interface IResponseGetStepsStatus {
    personalStatus: number;
    passportStatus: number;
    ieStatus: number;
    photoStatus: number;
    skillStatus: number;
    regionStatus: number;
}

export interface IRequestRegistration {
    specializations: {
        skills: number[];
        tools: number[];
    };
    personal: UserInfoStore;
    regions: {
        mainRegion: number;
        additional: number[];
        misc: number[];
    };
    call: Range;
}

export interface Range {
    from: number;
    to: number;
}

export interface IResponseRegistration {
    numberAndSeries: string;
    whenIssued: string;
    issuedBy: string;
}

export interface Wallet {
    text: string;
    type: string;
    walletType: string;
    taskId: number;
    amount: number;
    performerId: number;
    isExpendable: boolean;
    vatMoneyAmount?: number;
}

export interface PayoutConfig {
    balance: number;
    blockTilDate: string;
    categoryBalance: number;
    expendableBalance: number;
    ieData: {
        bank_name: string;
        bik: string;
        checking_account: string;
        correspondent_account: string;
        user_id: number;
    };
    services: PayoutConfigServices;
    state: string;
}

export interface PayoutConfigServices {
    ie: ConfigServiceIE;
    payinpayout_card: ConfigServiceCard;
    qiwi_qiwi: ConfigServiceQiwi;
    state: string;
}

export interface ConfigService {
    blockAccount: boolean;
    blockMoney: boolean;
    maxAmount: number;
    minAmount: number;
    name: string;
    service: string;
}

export interface ConfigServiceCard extends ConfigService {
    accounts: Account[];
    dailyLimit: number;
}

export interface ConfigServiceQiwi extends ConfigService {
    accounts: number[];
    dailyLimit: number;
    compensation: number;
}

export interface ConfigServiceIE extends ConfigService {
    accounts: Account[];
}

export interface Account {
    add_date: string;
    bank_name: string;
    card_number: string;
    delete_date: string;
    is_deleted: boolean;
    last_use_date: string;
    mask: string;
    synonym: string;
    type: number;
    use_count: number;
    user_id: number;
}

export enum PassportStatus {
    REJECTED = 1,
    REQUESTED,
    NOT_REQUESTED,
    APPROVED,
}

export interface SaveAdditionalPhone {
    phone_additional: string | null;
}
