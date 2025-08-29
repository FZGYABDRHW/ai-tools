
export const ROLE_BLOCKED = 'roleBlocked';
export const ROLE_HUNTER = 'roleHunter';
export const ROLE_HUNTER_B2B2C = 'roleHunterB2B2C';
export const ROLE_SHOP = 'roleShop';
export const ROLE_ACCOUNT_MANAGER = 'roleAccountManager';
export const ROLE_SALES_MANAGER = 'roleSalesManager';
export const ROLE_CURATOR_ADMIN = 'roleCuratorAdmin';
export const ROLE_CURATOR_B2B2C = 'roleCuratorB2B2C';
export const ROLE_CURATOR = 'roleCurator';
export const ROLE_X5_MANAGER_USER = 'x5ManagerRole';
export const ROLE_ORGANIZATION_USER = 'roleOrganizationUser';
export const ROLE_ORGANIZATION_ADMIN = 'roleOrganizationAdmin';
export const ROLE_PERFORMER = 'rolePerformer';
export const ROLE_ADMIN = 'roleAdmin';
export const ROLE_CLEANING_ADMIN = 'roleCleaningAdmin';
export const ROLE_PURCHASING_MANAGER = 'purchasingManager';
export const ROLE_SELF_DELETED = 'roleSelfDeleted';
export const ROLE_QA = 'roleQA';
export const ROLE_TEST_ACCOUNT = 'roleTestAccount';
export const ROLE_HUNTER_ADMIN = 'roleHunterAdmin';
export const ROLE_WOWWORKS = 'roleWowworks';
export const ROLE_HUNTER_CLEANING_TEAM = 'hunterCleaningTeam';
export const ROLE_CURATOR_MAINTENANCE_TEAM = 'curatorMaintenanceTeam';
export const ROLE_INDIVIDUAL_ENTREPRENEUR = 'roleIndividualEntrepreneur';
export const ROLE_NEWBIE_CURATOR = 'roleNewbieCurator';
export const ROLE_CURATOR_CLEANING_TEAM = 'curatorCleaningTeam';
export const ROLE_CURATOR_IT_TEAM = 'curatorItTeam';
export const ROLE_ORGANIZATION_BASE = 'roleOrganizationBase';
export const ROLE_VIP_ADMIN = 'roleVipAdmin';
export const ROLE_DOCUMENT_MANAGER = 'roleDocumentManager';
export const ROLE_ORGANIZATION_SIMPLE_TASK_CREATOR = 'roleOrganizationSimpleTaskCreator';
export const ROLE_ORGANIZATION_SIMPLE_TASK_ADMIN = 'roleOrganizationSimpleTaskAdmin';
export const ROLE_MODERATOR = 'roleModerator';
export const ROLE_ORGANIZATION_BETA_TESTER = 'roleOrganizationBetaTester';
export const ROLE_HELP_DESK_USER = 'roleHelpdeskUser';
export const ROLE_CONTRACTOR_COMPANY = 'roleContractorCompany';

export interface User {
    id: number;
    photoId: number;
    firstName: string;
    secondName: string;
    thirdName: string;
    lastEnteringDate: string;
    roles: ReadonlyArray<UserRole>;
    userTime: string;
    phone?: string;
    email?: string;
    primaryRole?: string;
    isSleeping?: boolean;
    isValidIndividualEntrepreneur?: boolean;
}

export interface UserOrganization {
    id: number;
    position: string;
    departmentId: number;
    organizationId: number;
    isNew: boolean;
}

export interface ResponsibleUser {
    id: number;
    photoId?: number;
    firstName?: string;
    secondName?: string;
    thirdName?: string;
}

export interface ResponsibleUsersParams {
    query?: string;
    limit?: number;
    offset?: number;
}

export type UserRole =
    | 'roleBlocked'
    | 'roleHunter'
    | 'roleHunterB2B2C'
    | 'roleShop'
    | 'roleAccountManager'
    | 'roleSalesManager'
    | 'roleCuratorAdmin'
    | 'roleCuratorB2B2C'
    | 'curatorItTeam'
    | 'roleCurator'
    | 'roleOrganizationUser'
    | 'roleOrganizationAdmin'
    | 'roleIndividualEntrepreneur'
    | 'rolePerformer'
    | 'roleAdmin'
    | 'roleCleaningAdmin'
    | 'x5ManagerRole'
    | 'purchasingManager'
    | 'roleSelfDeleted'
    | 'roleQA'
    | 'roleTestAccount'
    | 'roleHunterAdmin'
    | 'roleWowworks'
    | 'hunterCleaningTeam'
    | 'curatorMaintenanceTeam'
    | 'roleIndividualEntrepreneur'
    | 'roleNewbieCurator'
    | 'curatorCleaningTeam'
    | 'curatorItTeam'
    | 'roleOrganizationBase'
    | 'roleVipAdmin'
    | 'roleDocumentManager'
    | 'roleOrganizationSimpleTaskCreator'
    | 'roleOrganizationSimpleTaskAdmin'
    | 'roleOrganizationBetaTester'
    | 'roleHelpdeskUser'
    | 'roleContractorCompany';

export interface UserAnnotations {
    items: ReadonlyArray<Partial<UserAnnotation>>;
    totalCount: number;
}

export enum PerformerTypes {
    Common = 'type_performer_common',
    Ie = 'type_performer_individual_entrepreneur',
    SelfEmployed = 'type_performer_self_employed',
}

export type AnnotationType = 0 | 1 | 3;

export const COMMON_ANNOTATION = 0;
export const DELETE_BAN_ANNOTATION = 1;
export const REPORT_ANNOTATION = 3;

export interface UserAnnotation {
    id: number;
    authorId: number;
    userId: number;
    createDate: string;
    type: AnnotationType;
    text: string;
    entityName: string;
    entityId: number;
}

export interface SelfEmloyed {
    userId: number;
    inn: string;
    registerCertificateNumber: string;
    registeredAt: string;
    cancelledRegisterAt: string;
    lastUpdateAt: string;
    isActiveSelfEmployed: string;
}

export interface GetListUserParams {
    ids?: string;
    roleName?: string;
    limit?: number;
    offset?: number;
    query?: string;
}

export interface PerformerProfile {
    id: number;
    birthday: string;
    passportSerial: string;
    passportDate: string;
    passportPodr: string;
    passportBirthplace: string;
    snils: string;
    additionalPhone: string;
    isInSelfEmployedRegion: boolean;
    performerType: string;
    tasksCount: {
        limit: number;
        done: number;
        inWork: number;
        withoutSelfEmployedProfileAvailableTaskCount: number;
    };
    rating: {
        total: number;
        speed: number;
        quality: number;
        politeness: number;
        tasksCount: number;
        betterThan: number;
    };
    isNew: boolean;
}

export enum DepartmentType {
    B2B2C = 'B2B2C',
    B2C = 'B2C',
    DELIVERY = 'delivery',
}

export interface Department {
    id: number;
    name: string;
    departmentType: {
        id: number;
        name: DepartmentType.B2B2C | DepartmentType.B2C | DepartmentType.DELIVERY;
    };
}

export interface LastCalledNumber {
    lastCalledNumber: string;
}

export interface BindSelfEmployedInfo {
    id: number;
    userId: number;
    step: string;
    status: string;
    faultMessage: string;
    createdAt: string;
}

export interface BindStep {
    bindStepId?: number;
}

export interface JWT {
    token: string;
}

// TODO Name is not correct and this interface into config?
export enum LoginByEmailPortal {
    COMPANY = 'company',
    CONTRACTOR_COMPANY = 'contractor-company',
}

export interface LoginByEmailParams {
    email: string;
    portal: LoginByEmailPortal;
}
