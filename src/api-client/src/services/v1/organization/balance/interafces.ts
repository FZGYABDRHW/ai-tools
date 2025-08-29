import { PriceWithCurrency } from '../../../interfaces';

export interface DepartmentBalance {
    isCredit: boolean;
    main: Model;
    models: Model[];
}

export interface Model {
    id: number;
    name: string;
    balance: string;
    balanceWithCurrency: PriceWithCurrency;
    organization_id: number;
}
