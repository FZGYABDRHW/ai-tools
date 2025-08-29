export interface Franchise {
    id: number;
    address: string;
    advance_bill_type: number;
    coefficient: number;
    common_document_pack_type: number;
    franchise_head_name: string;
    franchise_head_signature: number;
    franchise_inn: string;
    franchise_kpp: string;
    franchise_main_accountant_name: string;
    franchise_main_accountant_signature: number;
    franchise_stamp: number;
    full_name: string;
    nick_name: string;
    short_name: string;
}

export interface FranchiseBankAccount {
    id: number;
    bank_bik: string;
    bank_corresponding_account: string;
    bank_name: string;
    bill_account: string;
    deleted_at: string;
    franchise_id: string;
}
