export interface IBookingModel {
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

export interface IChangedStatusBookingModel {
    id: number,
    hotel_id: number,
    room_id: number,
    user_id: number,
    payment_id: number,
    created: string,
    payment_status: string
}