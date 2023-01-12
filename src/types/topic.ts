export interface Topics {
    by: string;
    descendants?: number;
    id: number;
    kids?: Array<number>;
    parent?: number;
    score?: number;
    text: string;
    time: number;
    title: string;
    type: string;
    duration?: string;
    comments?: Topics;
}