export interface Task {
    id: number;
    name: string;
    gmt: string;
    description: string;
    timing: Timing;
    price: Price;
    shop: Shop;
    organization: Organization;
    performer: Performer;
    curator: Curator;
    organizationUser: OrganizationUser;
    important: boolean;
    personalAnnotation: boolean;
    isNewOrganization: boolean;
    curatorVisited: boolean;
    night: boolean;
    urgent: boolean;
    personal: boolean;
    commentsCount: number;
    actionExpected: boolean;
    newCommentsCount: number;
    smsCount: number;
    suitablePerformersCount: number;
    newSmsCount: number;
    curatorTeam: number;
    warningTask: boolean;
    newEvents: boolean;
    status: number;
}

export interface Timing {
    create_date: string;
    begin_date: string;
    inwork_date: string;
    plan_close_date: string;
    performer_close_date: string;
    organization_confirm_date: string;
    changing_date: string;
}

export interface Price {
    performer: number;
    organization: number;
}

export interface Shop {
    id: number;
    name: string;
    address: string;
}

export interface Organization {
    id: number;
    name: string;
    logo_id: number;
}

export interface Performer {
    id: number;
    first_name: string;
    second_name: string;
    phone: number;
    photo_id: number;
    rating: number;
}

export interface Curator {
    id: number;
    first_name: string;
    second_name: string;
    phone: number;
    photo_id: number;
}

export interface OrganizationUser {
    id: number;
    first_name: string;
    second_name: string;
    phone: number;
    photo_id: number;
}

export interface ListQueryParams {
    limit?: number;
    offset?: number;
    query?: string;
    urgent?: number | string;
    personal?: number | string;
    night?: number | string;
    status?: number;
    unread?: number | string;
    curator?: number;
    city?: number;
    performer?: number;
    organization?: number;
    organizationUser?: number | string;
    timeRangeFrom?: string;
    timeRangeTo?: string;
    timing?: number;
    curatorTeam?: number;
    hunter?: number;
    sales?: number;
    account?: number;
    similarTaskId?: number;
    taskArriveOnTimeRequirement?: number;
    departmentId?: number;
}

export interface Count {
    count: number;
}
