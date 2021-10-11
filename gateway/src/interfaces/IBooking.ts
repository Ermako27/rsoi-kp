export interface IBookingData {
    hotel_id: number;
    room_id: number;
    user_id: number;
    payment_id: number;
}

export interface IBookingModel {
    id: number;
    hotel_id: number;
    room_id: number;
    user_id: number;
    payment_id: number;
    created: any;
}

export interface IRoomModel {
    id: number;
    hotel_id: string;
    room_number: number;
    room_status: string;
    room_cost: number;
}

export interface IPaymentModel {
    id: number;
    payment_status: string;
    price: string;
}

export enum RoomStatuses {
    AVALIABLE = 'AVALIABLE',
    BOOKED = 'BOOKED'
}