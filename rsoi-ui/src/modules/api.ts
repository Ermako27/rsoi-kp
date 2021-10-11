import {
    ILogin,
    IServiceResponse,
    prodHost,
    devHost,
    ISignUp
} from './interfaces/IApi';
import { IUserModel } from '../interfaces/IUser';
import {IHotelModel, IRoomModel, IHotelData, IRoomData} from '../interfaces/IHotel';
import {IBookingModel, IChangedStatusBookingModel} from '../interfaces/IBooking';
import {ILoyaltyModel} from '../interfaces/ILoyalty';
import {IPaymentReport} from '../interfaces/IReport';

const host = process.env.NODE_ENV === "production" ? prodHost : devHost;

const login = async (data: ILogin): Promise<IServiceResponse<{user: IUserModel}>> => {
    const result = await fetch(`${host.session}/api/v1/login` , {
        method: "POST",
        headers: {
            'Authorization': `Basic ${data.email}:${data.password}`,
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
        credentials: 'include',
        mode: 'cors'
    })
    const jsonData = await result.json();
    return jsonData;
}

const logout = async (): Promise<IServiceResponse<{message: string}>> => {
    const result = await fetch(`${host.session}/api/v1/logout` , {
        method: "POST",
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
        credentials: 'include'
    })
    const jsonData = await result.json();
    return jsonData;
}

const signUp = async (data: ISignUp): Promise<IServiceResponse<{user: IUserModel}>> => {
    const result = await fetch(`${host.session}/api/v1/users` , {
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
        method: "POST",
        mode: 'cors',
        credentials: 'include'
    });
    const jsonData = await result.json();
    return jsonData;
}

const getHotels = async (): Promise<IServiceResponse<{hotels: IHotelModel[]}>> => {
    const result = await fetch(`${host.gateway}/api/v1/hotels` , {
        method: "GET",
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
        credentials: 'include'
    });

    const jsonData = await result.json();
    return jsonData;

}

const getHotel = async (hoteId: number): Promise<IServiceResponse<{hotel: IHotelModel}>> => {
    const result = await fetch(`${host.gateway}/api/v1/hotels/${hoteId}` , {
        method: "GET",
        mode: 'cors',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
    });

    const jsonData = await result.json();
    return jsonData;

}

const getHotelRooms = async (hoteId: number): Promise<IServiceResponse<{rooms: IRoomModel[]}>> => {
    const result = await fetch(`${host.gateway}/api/v1/hotels/${hoteId}/rooms` , {
        method: "GET",
        mode: 'cors',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
    });

    const jsonData = await result.json();
    return jsonData;
}

const bookRoom = async (room_id: number, hotel_id: number, room_price: number): Promise<IServiceResponse<{booking: IBookingModel}>> => {
    const result = await fetch(`${host.gateway}/api/v1/bookings` , {
        body: JSON.stringify({
            room_id,
            hotel_id,
            room_price
        }),
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
        method: "POST",
        mode: 'cors',
        credentials: 'include'
    });

    const jsonData = await result.json();
    return jsonData;
}

const getUserBookings = async (): Promise<IServiceResponse<{bookings: IBookingModel[]}>> => {
    const result = await fetch(`${host.gateway}/api/v1/bookings` , {
        method: "GET",
        mode: 'cors',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
    });

    const jsonData = await result.json();
    return jsonData;
}

const getUserLoyalty = async (): Promise<IServiceResponse<{loyalty: ILoyaltyModel}>> => {
    const result = await fetch(`${host.gateway}/api/v1/loyalty` , {
        method: "GET",
        mode: 'cors',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
    });

    const jsonData = await result.json();
    return jsonData;
}

const payBooking = async (bookingId: number): Promise<IServiceResponse<{booking: IChangedStatusBookingModel}>> => {
    const result = await fetch(`${host.gateway}/api/v1/bookings/${bookingId}/pay` , {
        method: "POST",
        mode: 'cors',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
    });

    const jsonData = await result.json();
    return jsonData;
}

const reverseBooking = async (bookingId: number): Promise<IServiceResponse<{booking: IChangedStatusBookingModel}>> => {
    const result = await fetch(`${host.gateway}/api/v1/bookings/${bookingId}/reverse` , {
        method: "POST",
        mode: 'cors',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
    });

    const jsonData = await result.json();
    return jsonData;
}

const cancelBooking = async (bookingId: number): Promise<IServiceResponse<{booking: IChangedStatusBookingModel}>> => {
    const result = await fetch(`${host.gateway}/api/v1/bookings/${bookingId}/cancel` , {
        method: "POST",
        mode: 'cors',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
    });

    const jsonData = await result.json();
    return jsonData;
}

const createHotel = async (data: IHotelData): Promise<IServiceResponse<{hotel: IHotelModel}>> => {
    const result = await fetch(`${host.gateway}/api/v1/hotels` , {
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
        method: "POST",
        mode: 'cors',
        credentials: 'include'
    });

    const jsonData = await result.json();
    return jsonData;
}

const createHotelRoom = async (hotelId: number, data: IRoomData): Promise<IServiceResponse<{hotel: IRoomModel}>>  => {
    const result = await fetch(`${host.gateway}/api/v1/hotels/${hotelId}/rooms` , {
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
        method: "POST",
        mode: 'cors',
        credentials: 'include'
    });

    const jsonData = await result.json();
    return jsonData;
}

const getUsersReport = async (): Promise<IServiceResponse<{report: IPaymentReport[]}>> => {
    const result = await fetch(`${host.gateway}/api/v1/report/booking` , {
        method: "GET",
        mode: 'cors',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
        },
    });

    const jsonData = await result.json();
    return jsonData;
}

export const api = {
    login,
    logout,
    signUp,
    getHotels,
    getHotel,
    getHotelRooms,
    bookRoom,
    getUserBookings,
    getUserLoyalty,
    payBooking,
    reverseBooking,
    cancelBooking,
    createHotel,
    createHotelRoom,
    getUsersReport
}
