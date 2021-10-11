export interface ICreateHotelReqBody {
    title: string;
    city: string;
    hotel_address: string;
    rooms_count: number
}

export interface ICreateRoomReqBody {
    room_number: number;
    room_status: string;
    room_cost: number;
}

export interface IGetHotelReqParams {
    id: number
}

export interface ICreateRoomReqParams {
    hotel_id: number
}

export interface IGetHotelRoomsReqParams extends ICreateRoomReqParams {}

export interface IGetHotelRoomReqParams extends ICreateRoomReqParams {
    room_id: number
}
export interface IChangeRoomStatusReqParams extends ICreateRoomReqParams {
    room_id: number
}

export interface IChangeRoomStatusReqBody {
    room_status: string;
}