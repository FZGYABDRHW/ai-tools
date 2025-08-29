import BaseService from '../BaseServiceV4';
import { BaseResponse } from '../../interfaces';
import { AxiosRequestConfig } from 'axios';
import { Shop } from './shop/interfaces';
import {
    Branch,
    CategoryPriceList,
    Contract,
    Department,
    DepartmentList,
    GetContractList,
    GetOrganizationBranchParams,
    GetOrganizationPriceList,
    GetPriceCategoryList,
    GetPriceListParams,
    List,
    Organization,
    OrganizationBranches,
    OrganizationPriceList,
    Payment,
    PaymentListQuery,
    PriceList,
    SalesManagersList,
    Suborganization,
    Supplier,
    SuppliersQuery,
    TasksReportData,
    CreateSupplierPaymentParams,
    SupplierPaymentResponse,
    GetDepartmentsListParams,
} from './interfaces';

export class OrganizationService extends BaseService {
    private readonly url: string = `${this.baseUrl}/organization`;

    public readonly get = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Organization>>(`${this.url}/${id}`, options)
            .then(resp => resp.data.response);

    public readonly getBranches = (
        organizationId: number,
        params?: GetOrganizationBranchParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<OrganizationBranches>>(`${this.url}/${organizationId}/branch`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly getSuppliers = (params?: SuppliersQuery, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<List<Supplier>>>(`${this.url}/suppliers`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getList = (ids: number[], limit?: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<{ items: Organization[] }>>(`${this.url}`, {
                params: {
                    ids: ids.join(','),
                    limit: limit,
                },
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly findDuplicates = (
        subOrganizationId: number,
        params: { address: string },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<List<Shop>>>(
                `${this.url}/suborganization/${subOrganizationId}/shop/find-duplicates`,
                { params, ...options },
            )
            .then(resp => resp.data.response);

    public readonly getDepartmentsList = (
        id: number,
        params?: GetDepartmentsListParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<List<Department>>>(`${this.url}/${id}/department`, {
                params,
                ...options,
            })
            .then(resp => resp.data.response);

    public readonly getDepartments = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Department>>(`${this.url}/department/${id}`, options)
            .then(resp => resp.data.response);

    public readonly getSuborganization = (id: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Suborganization>>(`${this.url}/suborganization/${id}`, options)
            .then(resp => resp.data.response);

    public readonly getExpendablePriceList = (
        organizationId: number,
        departmentId: number,
        params?: GetPriceListParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<PriceList>>(
                `${this.url}/${organizationId}/department/${departmentId}/expendable-price-list`,
                {
                    params,
                    ...options,
                },
            )
            .then(resp => resp.data.response);

    public readonly getExpendablePriceListByContract = (
        organizationId: number,
        contractId: number,
        params?: GetPriceListParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<PriceList>>(
                `${this.url}/${organizationId}/contract/${contractId}/expendable-price-list`,
                {
                    params,
                    ...options,
                },
            )
            .then(resp => resp.data.response);

    public readonly getContractList = (
        id: number,
        params?: GetContractList,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Contract>>(`${this.url}/${id}/contract`, { params, ...options })
            .then(resp => resp.data.response);

    public readonly getDepartmentsListUnderContract = (
        organizationId: number,
        contractId: number,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<DepartmentList>>(
                `${this.url}/${organizationId}/contract/${contractId}/departments`,
                options,
            )
            .then(resp => resp.data.response);

    public readonly getBranch = (branchId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<Branch>>(`${this.url}/branch/${branchId}`, options)
            .then(resp => resp.data.response);

    public readonly getBranchByCoordinates = (
        organizationId: number,
        params: { longitude: number; latitude: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<Branch>>(
                `${this.url}/${organizationId}/branch/branch-by-coordinates`,
                { params, ...options },
            )
            .then(resp => resp.data.response);

    public readonly getOrganizationPriceList = (
        organizationId: number,
        params?: GetOrganizationPriceList,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<OrganizationPriceList>>(
                `${this.url}/${organizationId}/contract/price-list`,
                { params, ...options },
            )
            .then(resp => resp.data.response);

    public readonly getCategoryPriceList = (
        organizationId: number,
        priceId: number,
        params?: CategoryPriceList,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<GetPriceCategoryList>>(
                `${this.url}/${organizationId}/contract/price-list/${priceId}`,
                { params, ...options },
            )
            .then(resp => resp.data.response);

    public readonly sendTasksData = (
        organizationId: number,
        data: TasksReportData,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<{ fileId: number; fileName: string }>>(
                `${this.url}/${organizationId}/report/tasks`,
                data,
                options,
            )
            .then(response => response.data.response);

    public readonly getSalesManager = (
        organizationId: number,
        params?: { userId?: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<SalesManagersList>>(`${this.url}/${organizationId}/sales-manager`, {
                params,
                ...options,
            })
            .then(response => response.data.response);

    public readonly getEmails = (organizationId: number, options?: AxiosRequestConfig) =>
        this.http
            .get<BaseResponse<string[]>>(`${this.url}/${organizationId}/emails`, options)
            .then(response => response.data.response);

    public readonly updateEmails = (
        organizationId: number,
        emails: string[],
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .put<BaseResponse<null>>(`${this.url}/${organizationId}/emails`, emails, options)
            .then(response => response.data.response);

    public readonly getSupplierPaymentList = (
        params: PaymentListQuery,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<List<Payment>>>(`${this.url}/supplier/payments`, {
                params,
                ...options,
            })
            .then(response => response.data.response);

    public readonly getPaymentTaskLink = (
        params: { payment_id: number },
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .get<BaseResponse<{ task_id: number }>>(`${this.url}/supplier/payment/linked-task`, {
                params,
                ...options,
            })
            .then(response => response.data.response);

    public readonly createSupplierPayment = (
        params: CreateSupplierPaymentParams,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .post<BaseResponse<SupplierPaymentResponse>>(
                `${this.url}/supplier/payment`,
                params,
                options,
            )
            .then(response => response.data.response);

    public readonly changePaymentStatus = (
        id: number,
        status: string,
        options?: AxiosRequestConfig,
    ) =>
        this.http
            .patch<BaseResponse<SupplierPaymentResponse>>(
                `${this.url}/supplier/payment/${id}/${status}`,
                options,
            )
            .then(response => response.data.response);
}

export default new OrganizationService();
