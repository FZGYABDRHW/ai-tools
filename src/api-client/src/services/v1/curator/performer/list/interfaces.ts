export interface IUserListQueryParams {
    orderBy?: string;
    limit?: number;
    offset?: number;
    query?: String;
    skillId?: number;
    regionId?: any;
    toolId?: string;
    performerType?: string;
    language?: string;
}

export interface IBasicListItem {
    id: number;
    first_name: string;
    second_name: string;
    phone: number;
    photo_id: number;
}

export interface IListItem extends IBasicListItem {
    delete_date: string;
    rating: {
        quality: number;
        better_than: string;
        politeness: number;
        tasks_count: number;
        total: number;
    };
    tasks_in_work: number;
    tasks_done: number;
    skills: string[];
    regions: string[];
}

export interface IListInvitedItem extends IListItem {
    curator_id: number;
    message: string;
    message_date: number;
    city: string;
    photo: string;
    curator: string;
    curator_photo_id: number;
}

export interface IListOnModerationItem extends IListItem {
    interview_time: {
        from: string;
        to: string;
    };
    sleeping: boolean;
    isNew: boolean;
    passport_check_expected: boolean;
    questionnaire_date: string;
    time_out: boolean;
    timezone: string;
    server_time: string;
    user_local_time: string;
    requested_skills: string[];
    region: string;
}

export interface ITabsCounts {
    moderation: number;
    active: number;
    active_ie: number;
    moderation_ie: number;
    blocked: number;
    deleted: number;
    invited: number;
    inactive: number;
    zombie: number;
}

export interface IPerformer {
    id: number;
    local_time: number;
    timezone: number;
    passport: IPerformerPassport;
    intro_questionnaire: IQuestionnaire;
    skill: ISkillPerformer;
}

export interface IPerformerPassport {
    date: string;
    minutes_left: number;
}

export interface IQuestionnaire {
    date: string;
    minutes_left: number;
}

export interface ISkillPerformer {
    date: string;
    minutes_ago: number;
}

export interface ElectricianPerformers {
    totalCount: number;
    items: ElectricianPerformer[];
}

export interface ElectricianPerformer {
    id: number;
    name: string;
    city: string;
    documents: ElectricianPerformerFiles[];
}

export interface ElectricianPerformerFiles {
    id: number;
}

export interface ElectricianPerformerParams {
    withoutDocs?: boolean;
    limit?: number;
    offset?: number;
}
