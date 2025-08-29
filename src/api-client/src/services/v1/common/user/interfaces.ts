import { UserRole } from '../../../v4/user/interfaces';

export interface User {
    id: number;
    name: string;
    photo_id: number;
    phone: number;
    isDeleted: boolean;
    intro_questionnaire: number;
    registration_date: string;
    last_entering_date: string;
    phone_accepted: boolean;
    email: string;
    team_id: number;
    primaryRole: string;
    roles: ReadonlyArray<UserRole>;
    profile?: {
        user_id: number;
        pbx_username: string;
        pbx_int_number: string;
        receive_tasks: boolean;
        pbx_status: number;
        pbx_last_call_date: string;
    };
}
