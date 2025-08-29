export interface WalletHistory {
    items: TaskHistory[];
    totalCount: number;
}

export interface TaskHistory {
    task: {
        id;
        number;
        name: string;
        relatedEntityName: 'cleaning_task' | 'task';
    };
    totalDeposit: number;
    totalPayout: number;
}

export interface TaskEvent {
    add_date: string;
    money_amount: string;
    text: string;
}
