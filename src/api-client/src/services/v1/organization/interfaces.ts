export interface Employee {
    firstName: string;
    secondName: string;
    thirdName: string;
    email: string;
    phone: number;
    avatar: {
        id: number;
        mime: string;
        url: string;
        display_name: string;
        size: string;
        upload_date: string;
        is_viewed_by_user: boolean;
        GPS: {
            exist: boolean;
        };
    };
    fileManagerConfig: {
        type: number;
        modelId: number;
    };
}

export interface EditProfile {
    firstName: string;
    secondName: string;
    thirdName: string;
    email: string;
    phone: number;
}

export interface Departments {
    main: Department;
    models: Department[];
}

export interface Branch {
    id: number;
    name: string;
    created_at: string;
    deleted_at: string;
    is_deleted: string;
}

export interface Department {
    additional_works_strategy: number;
    annotation: string;
    balance_limit: number;
    contact_email: string;
    contact_name: string;
    contact_phone: string;
    delivery_type: number;
    department_type: number;
    id: number;
    is_blocked: boolean;
    is_deleted: number;
    month_limit: number;
    name: string;
    old_suborganizations: string;
    organization_id: number;
    overall_balance: number;
    post_address: string;
    price_id: number;
}

export interface Suborganization {
    id: number;
    name: string;
    juridical_address: string;
    requisites: {
        bik: string;
        account: string;
        correspondent_account: string;
        bank_name: string;
        kpp: string;
        inn: string;
    };
}
