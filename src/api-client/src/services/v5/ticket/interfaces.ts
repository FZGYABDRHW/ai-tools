export enum UserGroup {
    PERFORMER = 1,
    ORGANIZATION,
    CURATOR,
}

export enum TicketStatusType {
    AWAITING = 1,
    IN_WORK,
    CURATOR_ANSWER,
    CURATOR_QUESTION,
    CLOSED,
}

export enum TicketMessageType {
    USER = 1,
    CURATOR,
    ANNOTATION,
    LOG,
    GUEST,
}

export interface ListResponse<T> {
    items: ReadonlyArray<T>;
    totalCount: number;
}

export interface TicketFilter {
    id: number;
    userId: number;
    curatorId: number;
    name: string;
    statusValue: number;
    userGroup: string;
    ticketCategoryId: number;
    limit: number;
    offset: number;
}

export interface Ticket {
    id: number;
    name: string;
    createDate: string;
    updateDate: string;
    description: string;
    curatorId: number;
    userId: number;
    status: number;
    userGroup: number;
    messagesCount: number;
    ticketCategoryId: number;
}

export interface TicketFilterEntity {
    id: number;
    name: string;
}

export interface TicketMessage {
    id: number;
    addDate: string;
    withFiles: boolean;
    isDeleted: boolean;
    text: string;
    type: TicketMessageType;
    userId: number;
}

export interface TicketUser {
    id: number;
    name: string;
}

export interface TicketFile {
    id: number;
    mime: string;
    url: string;
    displayName: string;
    size: string;
    uploadDate: string;
    isViewedByUser: boolean;
    Gps: { exist: boolean };
    fileLink: string;
}

export interface TicketStatistics {
    openTickets: number;
    closedTickets: number;
    expiredTickets: number;
}
