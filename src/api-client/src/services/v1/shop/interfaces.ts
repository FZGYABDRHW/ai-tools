export interface Expendable {
    name: string | null;
    amount: number | null;
}

interface Service {
    name: string | null;
    amount: number | null;
}

interface FileManagerConfig {
    type: number | null;
    modelId: number | null;
}

interface OrganizationInfo {
    logo_id: number | null;
    brand: string | null;
}

interface OrganizationUser {
    name: string | null;
    photo_id: number | null;
}

interface Performer {
    name: string | null;
    photo_id: number | null;
}

export interface ITaskInfo {
    additional_requirement?: any | null;
    address: string | null;
    description: string | null;
    expendables: Expendable[] | null;
    fileManagerConfig: FileManagerConfig | null;
    id: number | null;
    name: string | null;
    organization: OrganizationInfo | null;
    organizationUser: OrganizationUser | null;
    performer: Performer | null;
    performer_close_date: string | null;
    services: Service[] | null;
    error?: boolean;
}

export enum ActionMethodShopLogin {
    DONE = 'actionRating',
    NOT_DONE = 'actionNotDone',
}

export interface ShopLogin {
    key: string;
    actionMethod: ActionMethodShopLogin;
}

export interface ShopInfo {
    organizationName: string;
    organizationLogoFileId: number;
    shopAddress: string;
    cleanerFullName: string;
    month: number;
    year: number;
}

export interface CalendarParams {
    id: number;
    is_completed: boolean;
}

export interface ModalTaskList {
    id: number;
    name: string;
    isChecked: boolean;
}

export interface EditCalendarParams {
    calendar_data: CalendarParams[];
    comment?: string;
    file_ids: number[];
}

export interface CleaningCalendar {
    items: CleaningCalendarItem[];
    total_count: number;
}

export interface ActComment {
    act_comment: string;
}

export interface File {
    id: number;
    mime: string;
    size: number;
    upload_date: string;
    display_name: string;
    type: number;
}

export interface ActFiles {
    items: File;
    total_count: number;
}

export interface GetCalendarParams {
    limit?: number;
    offset?: number;
}

export interface CategoryCalendar {
    id: number;
    name: string;
}

export interface PerformerCalendar {
    id: number;
    name: string;
}

export interface CleaningCalendarItem {
    id: number;
    cleaning_task_id: number;
    date: string;
    is_completed: boolean;
    category: CategoryCalendar;
    performer: PerformerCalendar;
}
