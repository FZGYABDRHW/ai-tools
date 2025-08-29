export interface ServiceActivationParams {
    serviceCode: string;
    executionAddress: string;
    beginDate: string;
    userName: string;
    userPhone: string;
}

export interface ServiceActivationResponse
    extends Pick<
        ServiceActivationParams,
        'executionAddress' | 'beginDate' | 'userName' | 'userPhone'
    > {
    serviceName: string;
}
