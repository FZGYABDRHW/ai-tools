export interface Cost {
    currency: string;
    money_amount: number;
}

export interface Franchise {
    id: number;
    full_name: string;
    franchise_head_name: string;
    with_vat: true;
}

export interface Suborganization {
    id: number;
    official_name: string;
    country_vat_rate: number;
}

export interface Employee {
    first_name: string;
    second_name: string;
    third_name: string;
}

export interface Task {
    id: number;
    name: string;
}

export interface Location {
    id: number;
    address: string;
}

export interface Expendable {
    id: number;
    name: string;
    quantity: number;
    unit_cost: Cost;
    total_cost: Cost;
}

export interface Work {
    id: number;
    name: string;
    quantity: number;
    total_cost: Cost;
    unit_cost: Cost;
    expendables: Expendable[];
}

export interface TotalCost {
    cost_without_vat: Cost;
    cost_amount_with_vat: Cost;
    cost_vat: Cost;
}

export interface File {
    id: number;
    display_name: string;
}

export interface Reporting {
    act_of_completed_work: {
        files: File[];
    };
}

export interface PreActConfirmation {
    franchise: Franchise;
    suborganization: Suborganization;
    employee: Employee;
    task: Task;
    location: Location;
    works: Work[];
    unrelated_expendables: Expendable[];
    total_cost: TotalCost;
    reporting: Reporting;
}
