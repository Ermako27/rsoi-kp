export const devServicePaths = {
    session: 'http://127.0.0.1:3001',
    hotel: 'http://127.0.0.1:3002',
    payment: 'http://127.0.0.1:3003',
    loyalty: 'http://127.0.0.1:3004',
    bookings: 'http://127.0.0.1:3005',
}

export const prodServicePaths = {
    session: 'http://35.206.67.123',
    hotel: 'http://35.208.92.38',
    payment: 'http://35.208.91.25',
    loyalty: 'http://35.208.155.71',
    bookings: 'http://35.209.170.149',
}

export interface IBookingData {
    hotel_id: number;
    room_id: number;
    user_id: number;
    payment_id: number;
}

export interface IHotelModel {
    id: number;
    title: string;
    city: string;
    hotel_address: string;
    rooms_count: number;
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
    price: number;
}

export interface ILoyaltyModel {
    id: number;
    user_id: number;
    status: string;
    discount: number;
}

export enum RoomStatuses {
    AVALIABLE = 'AVALIABLE',
    BOOKED = 'BOOKED'
}


export interface IBookingWithContentModel {
    id: number,
    hotel_id: number,
    room_id: number,
    user_id: number,
    payment_id: number,
    created: string,
    hotel_title: string,
    hotel_city: string,
    hotel_address: string,
    room_number: number,
    room_status: string,
    room_cost: number,
    payment_status: string
}