export type RowValueGraph = [number, number][];
export type RowValueScalar = [number | null][];

export interface Column {
    display_name: string;
    base_type: string;
}

export interface CardData {
    cols: Column[];
    rows: RowValueScalar | RowValueGraph;
}

export interface Card {
    row_count: number;
    data: CardData;
}

export interface CardParam {
    id: string | null;
    type: string | null;
    value: string | null;
    target: any;
}

export interface CardParams {
    parameters: CardParam[];
}
