import { List } from '../interfaces';

export enum RateType {
    BONUS,
    TASK,
    REPORT,
    TASK_UNASSIGN,
    BAN,
    PERFORMER_REFUSE,
    PENALTY,
}

export enum RatingItemType {
    TASK = 'task',
    BONUS = 'bonus',
}

export enum PerformerSkillStatus {
    BEGINNER = 'beginner',
    EXPERIENCED = 'experienced',
    PRO = 'pro',
}

export enum NotificationGroupConstants {
    FIRST = 1,
    SECOND,
    THIRD,
    FOURTH,
    NO_GROUP = -1,
}

export interface RatingHistoryItem {
    createdAt: string;
    deletedAt: string | null;
    isPenalty: boolean;
    title: string;
    text: string | null;
    type: number;
    rate: number;
    taskRate: {
        quality: number;
        politeness: number;
        speed: number;
    } | null;
}

export interface RatingHistory extends List<RatingHistoryItem> {
    averageTaskRate: number;
    totalBonus: number;
}

export interface ProfileStatus {
    alias: string;
    name: string;
    nextLevelName: string;
    tasksDone: number;
    nextLevelTasksDone: number;
}

export interface TaskLimit {
    limit: number;
    text: string;
    additionalText: string;
}

export interface NotificationGroup {
    group: number;
    rate: number;
}

export interface Notification {
    text: string;
    additionalText: string;
    groups: NotificationGroup[];
    currentGroup: number;
}

export interface RatingDashboard {
    userId: number;
    status: ProfileStatus;
    rating: {
        rate: number;
        title: string;
        text: string;
    };
    tasksLimit: TaskLimit;
    notification: Notification;
    averageTaskRate: number;
    totalBonus: number;
}
