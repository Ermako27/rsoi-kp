export interface IHotelModel {
    id: number;
    title: string;
    city: string;
    hotel_address: string;
    rooms_count: number;
}

export interface IRoomModel {
    id: number;
    hotel_id: string;
    room_number: number;
    room_status: string;
    room_cost: number;
}

export enum RoomStatuses {
    AVALIABLE = 'AVALIABLE',
    BOOKED = 'BOOKED'
}

export interface IHotelData {
    title: string;
    city: string;
    hotel_address: string;
    rooms_count: number;
}

export interface IRoomData {
    room_number: number;
    room_status: string;
    room_cost: number;
}