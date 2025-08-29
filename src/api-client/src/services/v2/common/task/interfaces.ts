export interface SendQrData {
    receipt_fn: string;
    receipt_fd: string;
    receipt_fpd: string;
}

export interface ReceiptList {
    display_name: string;
    id: number;
    is_viewed_by_user: boolean;
    mime: string;
    size: number;
    upload_date: string;
    GPS: {
        exist: boolean;
    };
}

export interface Item {
    name: string;
    price: number;
    quantity: number;
    sun: number;
}

export interface Receipt {
    id?: number;
    cashTotalSum: number;
    dateTime: string;
    ecashTotalSum: number;
    fiscalDocumentNumber: number;
    fiscalDriveNumber: string;
    fiscalSign: number;
    items: Item[];
    kktRegId: string;
    nds18: string;
    operationType: number;
    operator: string;
    receiptCode: number;
    requestNumber: number;
    shiftNumber: number;
    taxationType: number;
    totalSum: number;
    user: string;
    userInn: string;
}

export interface Response {
    receipt: {
        document: {
            receipt: Receipt;
        };
    };
}
