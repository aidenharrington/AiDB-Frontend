

export interface Query {
    id: string | null;
    nlQuery: string;
    sqlQuery: string;
    status?: string;
    timestamp?: Date;
}