export interface ParamsSendMessage {
    text: string;
    type: number;
    fileId?: number;
}

export interface SendMessage {
    id: number;
    request_id: number;
    text: string;
    create_date: string;
    type: number;
    is_deleted: boolean;
    file_id: number;
}

export interface ChangeCurator {
    curatorId: number;
}

export interface ChangeStatus {
    status: number;
}

export interface ParamsTickets {
    id: number;
    user_id: number;
    curator_id: number;
    status: number;
    name: string;
    address_name: string;
    limit: number;
    offset: number;
}

export interface ParamsMes {
    limit: number;
    offset: number;
}

export interface TicketList {
    items: Ticket[];
    totalCount: number;
}

export interface Ticket {
    id: number;
    name: string;
    description: string;
    status: TicketStatus;
    create_date: string;
    update_date: string;
    curator: User;
    performer: User;
}

export interface TicketStatus {
    value: number;
    name: string;
}

export interface User {
    id: number;
    fullName: string;
}

export interface MessagesList {
    items: Message[];
    totalCount: number;
}

export interface Message {
    id: number;
    request_id: number;
    text: string;
    create_date: string;
    type: number;
    is_deleted: boolean;
    file_id: number;
    curator: User;
    performer: User;
}

export interface StatsTicket {
    openTickets: number;
    closedTickets: number;
    expiredTickets: number;
}

export interface Statuses {
    id: number;
    name: string;
}
