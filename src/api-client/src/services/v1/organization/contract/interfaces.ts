import { PriceWithCurrency } from '../../../interfaces';

export interface GetMinimalPriceParams {
    lat: number;
    lng: number;
    selectedServiceIds: number[];
}

export interface MinimalPrice {
    minimal_organization_price: PriceWithCurrency;
}
