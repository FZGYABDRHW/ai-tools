export interface Passport {
    aboutme: string;
    additional_phone: number;
    birthday: string;
    files: Files[];
    first_name: string;
    inWorkTaskCount: number;
    isPassportValid: boolean;
    lastCheckCurator: Curator;
    passportChangeDate: string;
    passport_birthplace: string;
    passport_date: string;
    passport_podr: string;
    passport_serial: string;
    public_status: string;
    rating: Rating;
    second_name: string;
    snils: number;
    third_name: string;
    user_id: number;
    validators: any;
}

export interface Files {
    Gps: { exist: boolean };
    display_name: string;
    id: number;
    is_viewed_by_user: boolean;
    mime: string;
    size: string;
    upload_date: string;
    url: string;
}

interface Curator {
    alreadyWasOnThisAddress: boolean;
    birthday: string;
    delete_date: string;
    email: string;
    first_name: string;
    id: number;
    isDeleted: boolean;
    last_entering_date: string;
    name: string;
    performerProfile: string;
    phone: number;
    phone_accepted: boolean;
    photo: string;
    photo_id: number;
    primaryRole: string;
}

interface PerformerProfile {
    aboutme: string;
    additional_phone: number;
    birthday: string;
    passport_birthplace: string;
    passport_date: string;
    passport_podr: string;
    passport_serial: string;
    public_status: string;
    inWorkTaskCount: number;
    rating: Rating;
    snils: number;
    user_id: number;
}

interface Rating {
    better_than: number;
    politeness: number;
    quality: number;
    speed: number;
    tasks_count: number;
    total: number;
}

export interface Balance {
    balance: number;
    categoryBalance: number;
    expendableBalance: number;
}

export interface Transaction {
    id: number;
    text: string;
    add_date: string;
    operationType: string;
    task_id: number;
    payment_system_type: string;
    accountNumber: string;
    annotation: string;
    money_amount: string;
    type: number;
    curator: TransactionCurator;
}

interface TransactionCurator {
    name: string;
}

export interface RegionsResponse {
    canChangeMainRegion;
    boolean;
    regions: Region[];
}

export interface Region {
    id: number;
    location_type: string;
    name_geocoded: string;
    short_name: string;
    timezone: string;
}

export interface TaskList {
    amount: number;
    kay: string;
    tasks: Task[];
    text: string;
}

export interface Task {
    commentsCount: number;
    curator: CuratorOnTask;
    curatorTeam: number;
    curatorVisited: boolean;
    description: string;
    hunter_id: number;
    id: number;
    important: boolean;
    name: string;
    new: boolean;
    newCommentsCount: string;
    newEvents: boolean;
    newSmsCount: string;
    night: boolean;
    organization: Organization;
    organizationUser: OrganizationUser;
    performer: Performer;
    personal: boolean;
    personalAnnotation: boolean;
    price: {
        organization: string;
        performer: string;
    };
    shop: {
        address: string;
        id: number;
        name: string;
    };
    smsCount: number;
    status: string;
    suitablePerformersCount: string;
    taskCancelReasonExplanation: string;
    taskCancelReasonType: number;
    timing: Timing;
    urgent: boolean;
    warningTask: boolean;
}

interface CuratorOnTask {
    id: number;
    name: string;
    photo: string;
    photo_id: number;
}

interface Hunter extends CuratorOnTask {
    photo_value: number;
}

interface Organization {
    id: number;
    logo: string;
    logo_id: string;
    name: string;
}

interface OrganizationUser {
    first_name: string;
    id: number;
    phone: number;
    second_name: string;
}

interface Performer extends OrganizationUser {
    photo: string;
    photo_id: number;
    rating: number;
}

interface Timing {
    begin_date: string;
    changing_date: string;
    create_date: string;
    inwork_date: string;
    organization_confirm_date: string;
    performer_close_date: string;
    plan_close_date: string;
}

export interface Event {
    birthday: string;
    date: string;
    email: string;
    first_name: string;
    id: number;
    passport_birthplace: string;
    passport_date: string;
    passport_podr: string;
    passport_serial: string;
    phone: number;
    second_name: string;
    third_name: string;
    user_id: number;
}

export interface ISkillHistory {
    curator: Curator;
    curator_id: number;
    date: string;
    event: string;
    id: number;
    new_status: number;
    old_status: number;
    skill_id: number;
    user_id: number;
    skill: Skill;
}

interface Skill {
    description: string;
    href: string;
    id: number;
    image_id: number;
    is_basic: number;
    is_deleted: number;
    name: string;
    requirements: string;
    uploadFiles: any;
}

export interface IE {
    curator: CuratorOnIE;
    files: Files[];
    isValid: boolean;
    lastChangeData: string;
    model: Model;
    validators: {
        bik: Validator;
        bank_name: Validator;
        checking_account: Validator;
        inn: Validator;
        name: Validator;
        registration_address: Validator;
    };
}

interface CuratorOnIE extends Curator {
    profile: Profile;
    registration_date: string;
    roles: string[];
    second_name: string;
    team_id: boolean;
    third_name: string;
}

interface Profile {
    pbx_int_number: string;
    pbx_last_call_date: string;
    pbx_status: number;
    pbx_username: string;
    receive_tasks: boolean;
    user_id: number;
}

interface Model {
    bank_name: string;
    bik: string;
    checking_account: string;
    inn: string;
    name: string;
    passportValidated: boolean;
    registration_address: string;
}

interface Validator {
    curator_id: number;
    date: string;
    id: number;
    key: string;
    status: number;
    user_id: number;
    validation: boolean;
}
