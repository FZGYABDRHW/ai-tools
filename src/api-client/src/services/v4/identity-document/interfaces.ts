export interface IdentityDocument {
    id: number;
    userId: number;
    country: string;
    number: string;
    birthDate: string;
    issueDate: string;
    issuedBy: string;
    expirationDate: string;
    nationalIdentificationNumber: string;
    address: string;
}

export interface IdentityDocumentValidity {
    documentFields: string[];
    validation: ValidationField[];
}

export interface ValidationField {
    id: number;
    curator_id: number;
    date: string;
    key: string;
    status: number;
    user_id: number;
    validation: boolean;
}
