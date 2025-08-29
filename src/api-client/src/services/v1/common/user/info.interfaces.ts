interface IUserRating {
    quality: number;
    politeness: number;
    total: number;
    tasks_count: number;
    better_than: string;
    inworkTaskCount: string;
}

interface IPerformerProfile {
    user_id: number;
    birthday: string;
    passport_serial: string;
    passport_date: string;
    passport_podr: string;
    passport_birthplace: string;
    snils: string;
    public_status: any;
    aboutme: string;
    rating: IUserRating;
}

interface IUserProfile {
    id: number;
    name: string;
    photo: string;
    phone: number;
    phone_accepted: boolean;
    email: string;
    team_id: number;
    performerProfile?: IPerformerProfile;
}

interface IUserContacts {
    phone: number;
    phoneAccepted: boolean;
    email: string;
}

export interface SupportPhone {
    support_phone: string;
}

interface IRole {
    name: string;
    description: string;
}

interface UserRole {
    role: string;
}

export { IUserRating, IPerformerProfile, IUserProfile, IUserContacts, IRole, UserRole };

export interface Permission {
    models: {
        createTask: boolean;
        publishTask: boolean;
    };
}

export interface VirtualInfo {
    name: string;
    phone: string;
    entityCode: number;
    entityId: number;
}
