interface BasePhoneInterface {
    phone: string;
}

export interface ChangePhoneResponse extends BasePhoneInterface {
    phone_accepted: boolean;
}

export interface ChangePhoneParams extends BasePhoneInterface {
    user_id: number;
}
