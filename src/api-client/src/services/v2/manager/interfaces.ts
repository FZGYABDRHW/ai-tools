export interface ManagerTask {
    actionExpected: boolean;
    commentsCount: number;
    curator: {
        id: number;
        name: string;
        photo_id: number;
    };
    description: string;
    gmt: string;
    id: number;
    name: string;
    newCommentsCount: number;
    newEvents: string[];
    night: boolean;
    performer: {
        id: number;
        name: string;
        photo_id: number;
        phone: number;
        rating: number;
    };
    personal: boolean;
    price: {
        organization: number;
        performer: number;
    };
    shop: {
        id: number;
        name: string;
        address: string;
    };
    status: number;
    sub_status: number;
    timing: {
        create_date: string;
        begin_date: string;
        inwork_date: string;
    };
    urgent: boolean;
}
