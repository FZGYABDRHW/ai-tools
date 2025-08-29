import { PriceWithCurrency } from '../../../../interfaces';

export const EXPENDABLE_WALLET_TYPE = 'expendable';
export const TOTAL_WALLET_TYPE = 'total';
export const WORK_WALLET_TYPE = 'work';
export const INDIVIDUAL_ENTERPRENEUR_WALLET_TYPE = 'ie';
export const SELF_EMPLOYED_WALLET_TYPE = 'self_employed';

export enum PerformerWalletTypes {
    Work = 'work',
    Expendable = 'expendable',
    SelfEmployed = 'selfEmployed',
    IE = 'ie',
}

export enum PayoutType {
    QIWI = 'qiwi',
    CARD = 'card',
    IE = 'ie',
    SELF_EMPLOYED = 'self_employed',
}

export interface UserPerformerWalletData {
    balance: number;
    balanceWithCurrency: PriceWithCurrency;
    type: PerformerWalletTypes;
    name: string;
    allowedSystems: ReadonlyArray<UserPerformerAllowSystem>;
    payoutTerms: string;
    payoutEnable: PayoutEnable;
}

export interface PayoutEnable {
    isPayoutEnabled: boolean;
    disableReason: string;
}

export interface UserPerformerAllowSystem {
    description: string;
    maxAmount: number;
    maxAmountWithCurrency: PriceWithCurrency;
    minAmount: number;
    minAmountWithCurrency: PriceWithCurrency;
    name: PayoutType;
}

export interface UserPerformerWallets {
    wallets: ReadonlyArray<UserPerformerWalletData>;
    total: number;
    totalWithCurrency: PriceWithCurrency;
}

export interface UserPerformerWalletStatus {
    status: {
        name: string;
        id: number;
    };
    canBeRejected: boolean;
    moneybackAvailable: boolean;
}
