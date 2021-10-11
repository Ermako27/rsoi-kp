export interface ICreateBookingreqBody {
    hotel_id: number;
    room_id: number;
    room_price: number;
}


export interface IGetBookingReqParams {
    id: number;
}

export interface IPayBookingReqParams {
    id: number;
}

export interface IReverseBookingReqParams {
    id: number;
}

export interface ICancelBookingReqParams {
    id: number;
}