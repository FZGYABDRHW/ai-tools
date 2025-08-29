export interface PaymentStatus {
    status: {
        name: string;
        id: string;
    };
    moneybackAvailable: boolean;
}

export interface ParamsAddPaymentCard {
    cardNumber: string;
    ownerName: string;
    validThruYear: number;
    validThruMonth: number;
}
