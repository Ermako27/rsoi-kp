export interface IPayment {
    id: number;
    payment_status: string;
    price: number;
}

export enum PaymentStatuses {
    NEW = 'NEW',
    PAID = 'PAID',
    REVERSED = 'REVERSED',
    CANCELED = 'CANCELED'
}