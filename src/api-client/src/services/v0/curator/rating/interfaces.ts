export interface UserInformation {
    id: number;
    month: string;
    name: string;
    photo: string;
    photo_id: number;
    primaryRole: string;
    roles: string[];
    tasks_closed_total: number;
    team_id: number;
    team_owner_id: number;
    year: string;
}

export interface RatingInfo {
    bonus_real: Bonus;
    bonus_real_today: Bonus;
    chart: number[];
    in_time_percent: Bonus;
    tasks_all: Bonus;
    tasks_attention: number;
    tasks_canceled: Bonus;
    tasks_closed: Bonus;
    tasks_closed_overdue?: Bonus;
    tasks_closed_today?: Bonus;
    tasks_inwork: Bonus;
    tasks_inwork_overdue?: Bonus;
    tasks_inwork_urgent?: number;
    tasks_new: Bonus;
    performers_checked?: Bonus;
    performers_checked_today?: Bonus;
    tasks_on_purchasing_moderation_overdue: Bonus;
    performers_failed?: number;
    performers_found?: Bonus;
    performers_found_newbie?: Bonus;
    performers_found_today?: Bonus;
    filter: Filter;
    tech_sup_rating?: number;
    estimate_rejects?: number;
    estimate_rejects_percent?: number;
    tab: number;
    url: string;
    value: number;
}

export interface Bonus {
    value: number;
    url: string;
    tab?: number;
    filter?: Filter[];
    plan: number;
}

export interface Filter {
    from?: string;
    key: string;
    to?: string;
    id?: number;
    value?: number;
    type: string;
}

export interface Teams {
    curators: TeamMember[];
    hunters: TeamMember[];
}

export interface TeamMember {
    data?: Curator;
    state?: State;
    chart?: number[];
}

interface State {
    busy: boolean;
    current: boolean;
    online: boolean;
    receive_tasks: number;
}

export interface TeamHead {
    data?: HeadCurator;
    state?: State;
}

export interface CuratorStats {
    data: Curator;
    state: State;
}

export interface HeadCurator {
    bonus_nominal: number;
    bonus_percent: number;
    curator_id: number;
    curator_name: string;
    in_time_percent: number;
    photo: string;
    plan_task_closed: number;
    tasks_all: string;
    tasks_attention: number;
    tasks_canceled: number;
    tasks_closed: {
        value: number;
        plan: number;
    };
    tasks_closed_overdue: number;
    tasks_closed_personal: string;
    tasks_closed_today: {
        value: number;
        plan: number;
    };
    tasks_inwork: number;
    tasks_inwork_overdue: number;
    tasks_inwork_urgent: number;
    tasks_on_purchasing_moderation_overdue: Bonus;
    tasks_new: number;
    team_id: number;
    team_name: string;
}

interface Curator {
    status?: boolean;
    bonus_nominal: string;
    bonus_real: Bonus;
    calls_missed: number;
    curator_id: number;
    curator_name: string;
    in_time_percent: Bonus;
    performers_called: number;
    photo: string;
    photo_id: number;
    plan_task_closed: number;
    tasks_all: Bonus;
    tasks_canceled: Bonus;
    tasks_closed: Bonus;
    tasks_closed_today?: Bonus;
    tasks_closed_overdue: Bonus;
    tasks_inwork: Bonus;
    tasks_inwork_overdue: string;
    tasks_new: Bonus;
    team_id: number;
    team_name: string;
}

export interface TeamInfo {
    create_date: string;
    id: number;
    name: string;
    owner_id: number;
    type: string;
}

export const TEAM_TYPE_HUNTERS = 'hunters';

export interface Params {
    type: string;
    month: number;
    year: number;
    curator_id?: number;
    period: string;
}

export interface CuratorRoles {
    name: string;
    description: string;
}
