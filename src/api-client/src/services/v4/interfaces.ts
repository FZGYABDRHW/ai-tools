export interface List<T> {
    items: T[];
    totalCount: number;
}

export interface ReadonlyList<Item> {
    items: ReadonlyArray<Item>;
    totalCount: number;
}
