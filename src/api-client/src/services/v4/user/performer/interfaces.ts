import { PriceWithCurrency } from '../../../interfaces';
import { PayoutType } from './wallet-card/interfaces';

export interface WalletStats {
    dynamicMonthStat: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
        6: number;
        7: number;
        8: number;
        9: number;
        10: number;
        11: number;
        12: number;
    };
    earnedMoneyPerPeriod: number;
    monthEarnedAvg: number;
    taskEarnedAvg: number;
    taskNumberPerPeriod: number;
    totalEarnedMoney: number;
    totalTaskNumber: number;
}

export interface WalletPayoutParams {
    payoutType: PayoutType;
    account: string | null;
    code: number;
    walletType: 'ie' | 'expandable' | 'work';
}

export interface HunterRegistrationModalResult {
    firstName: string;
    secondName: string;
    registrationCode?: string;
    thirdName?: string;
    birthday: string;
    phone: string;
    isOrganization?: boolean;
    taskComment?: string;
    email?: string;
}

export interface BasePerformerStatisticParams {
    month?: number;
    year: number;
}

export interface BasePerformerStatistic {
    totalEarned: number;
    totalDoneTasks: number;
}

export interface StatisticEarnedMoneyBySkillAndTerritory {
    items: EarnedMoneyBySkill[];
}

export interface EarnedMoneyBySkill {
    skillName: string;
    totalEarned: number;
    totalEarnedByUser: number;
}

export interface CommissionInfo {
    commission_percent: number;
    description: string | null;
    commission_money_amount: PriceWithCurrency;
    money_amount_after_commission: PriceWithCurrency;
    amount_transferring_commission: PriceWithCurrency;
    min_money_amount_without_commission: PriceWithCurrency;
}

export interface CommissionInfoParams {
    money_amount: number;
    payment_system: string;
    payout_type: PayoutType;
}

export enum PaymentSystems {
    SOLAR_STAFF = 'solarstaff',
}

export interface ConstructionWorksStatistic {
    limit: PriceWithCurrency;
    totalSum: PriceWithCurrency;
    withholdingVatRate: number;
}

export interface ConstructionWorksStatisticParams {
    task_id?: number;
}
