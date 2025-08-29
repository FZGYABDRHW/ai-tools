import { AxiosResponse } from 'axios';

export enum CurrencyCodes {
    PLN = 'PLN',
    EUR = 'EUR',
    GBP = 'GBP',
    RUB = 'RUB',
    NOK = 'NOK',
    BYN = 'BYN',
}

type CurrencySymbols = { [code in CurrencyCodes]: string };

export const currencySymbols: CurrencySymbols = {
    [CurrencyCodes.PLN]: 'zł',
    [CurrencyCodes.EUR]: '€',
    [CurrencyCodes.GBP]: '£',
    [CurrencyCodes.RUB]: '₽',
    [CurrencyCodes.NOK]: 'NKr',
    [CurrencyCodes.BYN]: 'Br',
};

export interface MessageTypes {
    SUCCESS: 0;
    VALIDATION_ERROR: 1;
    SERVER_ERROR: 2;
    LOG: 3;
    INFO: 4;
}

export interface ModelStatuses {
    SUCCESS: 200 | 201 | 0;
    ERROR: 100;
}

export interface CustomAxiosResponse<T> extends AxiosResponse<T> {}

export interface BaseResponse<T> {
    status: ModelStatuses[keyof ModelStatuses];
    response: T;
    messages: { message: string; type: MessageTypes[keyof MessageTypes] }[];
}

export interface PriceWithCurrency {
    moneyAmount: number;
    currency: CurrencyCodes | null;
}

export enum PerformerInvoicingModes {
    CreditNote = 'credit_note',
    SelfInvoice = 'self_invoice',
}

export interface PerformerInvoicingModeResponse {
    id: number;
    user_id: number;
    invoicing_mode: PerformerInvoicingModes;
}

export interface FileFromServer {
    Gps?: { exist: boolean };
    display_name: string;
    id: number;
    is_viewed_by_user?: boolean;
    mime: string;
    size: number | string;
    upload_date: string | Date;
    url?: string;
}
