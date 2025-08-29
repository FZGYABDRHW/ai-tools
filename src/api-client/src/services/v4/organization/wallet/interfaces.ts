import { PriceWithCurrency } from '../../../interfaces';

export interface BalanceDetails {
    reservedSum: number;
    availableBalance: number;
}

export interface BalanceDetailsWithCurrency {
    reservedSum: PriceWithCurrency;
    availableBalance: PriceWithCurrency;
}

export interface Wallet {
    id: number;
    organizationId: number;
    suborganizationId: number;
    departmentId: number;
    contractId: number;
    balance: number;
    balanceWithCurrency?: PriceWithCurrency;
    balanceDetails: BalanceDetails;
    balanceDetailsWithCurrency: BalanceDetailsWithCurrency;
    branchId: number;
}

export interface GetWalletListParams {
    suborganizationId?: number;
    departmentId?: number;
    contractId?: number;
    branchId?: number;
    limit?: number;
    offset?: number;
}

export interface Wallets {
    items: Wallet[];
    totalCount: number;
}
