import { UserRole } from '../../../v4/user/interfaces';
import { PriceWithCurrency } from '../../../interfaces';

export interface User {
    amount: number;
    task: string;
    comment: string;
    add: string;
    take: string;
    roles: UserRole[];
}

export interface Performer {
    activeCards: Card[];
    balance: number;
    balanceWithCurrency: PriceWithCurrency;
    cards: Card[];
    taskStats: TaskStat;
    user: LoginUser;
}

interface Card {
    add_date: string;
    bank_name: string;
    card_number: number;
    delete_date: string;
    is_deleted: boolean;
    last_use_date: string;
    mask: string;
    synonym: any;
    type: string | number;
    use_count: number;
    user_id: number;
}

interface TaskStat {
    done: number;
    in_work: number;
    in_work_limit: number;
    speed: number;
}

export interface LoginUser {
    additional_phone_accepted: boolean;
    alreadyWasOnThisAddress: boolean;
    birthday: string;
    delete_date: string;
    email: string;
    first_name: string;
    id: number;
    isDeleted: boolean;
    last_entering_date: string;
    name: string;
    performerProfile: PerformerProfile;
    phone: number | null;
    phone_accepted: boolean;
    photo: string;
    photo_id: number;
    primaryRole: string;
    profile: boolean;
    registration_date: string;
    second_name: string;
    team_id: number;
    third_name: string;
}

interface PerformerProfile {
    aboutme: string;
    additional_phone: number;
    birthday: string;
    inworkTaskCount: number;
    passport_birthplace: string;
    passport_date: string;
    passport_podr: string;
    passport_serial: string;
    public_status: string;
    rating: Rating;
}

interface Rating {
    better_than: number;
    politeness: number;
    quality: number;
    speed: number;
    tasks_count: number;
    total: number;
}

export interface PostAnnotation {
    code: number;
    message: string;
    name: string;
    status: number;
}
