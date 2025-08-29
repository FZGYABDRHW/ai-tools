export interface CheckingBankAccount {
    bik: string;
    checkingAccount: string;
}

export interface UserPerformerAddCardParams extends Partial<CheckingBankAccount> {
    cardNumber: string;
    ownerName: string;
    validThruMonth: number;
    validThruYear: number;
}

export interface UserPerformerCard extends Partial<CheckingBankAccount> {
    id: number;
    mask: string;
    validThruMonth: string;
    validThruYear: string;
    bik: null | string;
    checkingAccount: null | string;
    bankAccountRequired: boolean;
}

export interface EditCardParams extends CheckingBankAccount {}
