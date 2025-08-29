import { AxiosRequestConfig } from 'axios';
import BaseService from '../../BaseServiceV2';
import { BaseResponse } from '../../../interfaces';
import {
    Act,
    Bill,
    DownloadFileRequestParams,
    Finances,
    FinancesRequestParams,
    PaymentDocumentList,
    PaymentDocumentListParams,
    TotalDebtList,
    TotalDebtListParams,
} from './interfaces';

export class OrganizationFinances extends BaseService {
    private url = `${this.baseUrl}/organization/finances`;

    public readonly getFinancesBills = (
        params: FinancesRequestParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Finances<Bill>>>(`${this.url}/bills`, { params, ...options })
            .then<Finances<Bill>>(resp => resp.data.response);

    public readonly cancelBill = (billId: number, options?: AxiosRequestConfig) =>
        this.http
            .put<BaseResponse<Finances<Bill>>>(`${this.url}/bills/${billId}/cancel`, {}, options)
            .then(({ data: { response } }) => response);

    public readonly getFinancesActs = (
        params: FinancesRequestParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Finances<Act>>>(`${this.url}/acts`, { params, ...options })
            .then<Finances<Act>>(resp => resp.data.response);

    public readonly getPaymentDocuments = (
        params: PaymentDocumentListParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<PaymentDocumentList>>(`${this.url}/payment-documents`, {
                params,
                ...options,
            })
            .then<PaymentDocumentList>(resp => resp.data.response);

    public readonly getTotalDebtList = (
        params: TotalDebtListParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<TotalDebtList>>(`${this.url}/total-debt`, {
                params,
                ...options,
            })
            .then<TotalDebtList>(resp => resp.data.response);

    public readonly downloadFile = (
        params: DownloadFileRequestParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<Blob>(`${this.url}/download`, { params, responseType: 'blob', ...options })
            .then(resp => resp.data);

    public readonly getDownloadFileUrl = (id: number, token: string) => {
        const absoluteUrl: string = `${this.http.config.baseURL}${this.url}`;
        return `${absoluteUrl}/${id}/download?&access-token=${token}`;
    };
}

export default new OrganizationFinances();
