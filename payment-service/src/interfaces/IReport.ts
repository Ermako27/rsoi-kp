export interface IPaymentReport {
    id: number;
    user_id: number;
    username: string;
    total_count: string;
    unpaid: number;
    paid: number;
    reversed: number;
    canceled: number;
}