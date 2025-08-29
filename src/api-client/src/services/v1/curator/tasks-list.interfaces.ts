interface ITiming {
    create_date: string;
    begin_date: string;
    inwork_date: string;
    plane_close_date: string;
    organization_confirm_date: string;
    changing_date: string;
}

interface IShop {
    id: number;
    name: string;
    address: string;
    coords: string;
}

interface ICurator {
    id: number;
    name: string;
    photo_id: number;
}

interface IOrganization {
    id: number;
    name: string;
    logo: string;
    logo_id: number;
}

interface IOrganizationTask {
    id: number;
    name: string;
    gmt: string;
    description: string;
    timing: ITiming;
    shop: IShop;
    curator: ICurator;
    organization: IOrganization;
    night: boolean;
    urgent: boolean;
    commentsCount: number;
    personal: boolean;
    status: string;
    price: number;
}

interface ITabsTaskCountInfo {
    new: number;
    inWork: number;
    awaitingApprove: number;
    done: number;
    rejected: number;
}

interface IQueryTaskList {
    query?: string;
    limit?: number;
    offset?: number;
    status?: string;
}

interface IQueryCuratorTaskList extends IQueryTaskList {
    personal?: boolean;
    unread?: boolean;
    night?: boolean;
    creatorId?: number;
}

interface IQueryOrganizationTaskList extends IQueryTaskList {
    organizationUser?: number;
}

interface ICuratorTaskCount {
    personal?: boolean;
    unread?: boolean;
    urgetnt?: boolean;
    night?: boolean;
    creatorId?: number;
}

interface ICuratorTask extends IOrganizationTask {
    organization_user_id: number;
    newCommentsCount: number;
    actionExpected: boolean;
    newEvents: boolean;
}

interface ITaskListResponse {
    totalModelsCount: number;
    models: IOrganizationTask[] | ICuratorTask[];
}

interface IIdName {
    id: number;
    name: string;
}

interface IValueLabel {
    value: number;
    label: string;
}

interface IAccountsSales extends IValueLabel {
    organizations: string[];
}

interface ITaskListFilters {
    curatorTeam: IIdName[];
    timing: IIdName[];
    cancelReasons: IValueLabel[];
    curators: IIdName[];
    hunters: IIdName[];
    sales: IAccountsSales[];
    accounts: IAccountsSales[];
    cities: IValueLabel[];
    organizations: IValueLabel[];
}

interface IResponseGetHelp {
    id: number;
    first_name: string;
    second_name: string;
    third_name: string;
    email: string;
    phone: number;
    delete_date: string;
    registration_date: string;
    last_entering_date: string;
    inWorkTaskCount: string;
    doneTaskCount: number;
    rating: number;
    photo: string;
    photo_id: number;
    skills: string;
    cities: string;
}

interface IResponseGetNotification {
    id: number;
    userViewed: boolean;
    alreadyWasOnThisAddress: boolean;
    status: number;
    tasksCount: number;
    user: {
        id: number;
        name: string;
        photo: string;
        photo_id: number;
        phone: number;
        last_entering_date: string;
        performerProfile: {
            inworkTaskCount: number;
            rating: {
                quality: number;
                politeness: number;
                total: number;
                tasks_count: number;
                better_than: number;
            };
        };
    };
}

export {
    ITiming,
    IShop,
    ICurator,
    IOrganization,
    IOrganizationTask,
    ITabsTaskCountInfo,
    IQueryTaskList,
    IQueryCuratorTaskList,
    IQueryOrganizationTaskList,
    ICuratorTaskCount,
    ICuratorTask,
    ITaskListResponse,
    IIdName,
    IValueLabel,
    IAccountsSales,
    ITaskListFilters,
    IResponseGetHelp,
    IResponseGetNotification,
};
