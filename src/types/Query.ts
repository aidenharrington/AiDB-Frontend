import { Timestamp } from "firebase/firestore";

export interface Query {
    id: string | null;
    userId?: string;
    nlQuery: string;
    sqlQuery: string;
    status?: string;
    timestamp?: Timestamp | string;
}