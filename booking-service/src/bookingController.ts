import {Request, Response} from 'express';
import {IResponse, IServiceResponse} from './interfaces/IResponse';
import {
    ICreateBookingreqBody,
    IGetBookingReqParams,
    IPayBookingReqParams,
    IReverseBookingReqParams,
    ICancelBookingReqParams
} from './interfaces/IRequest';
import {
    devServicePaths,
    prodServicePaths,
    IRoomModel,
    IPaymentModel,
    RoomStatuses,
    ILoyaltyModel,
    IHotelModel,
    IBookingWithContentModel
} from './interfaces/IBooking';
import {BookingModel} from './bookingModel';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export class BookingController {
    private bookingModel: BookingModel;
    private jwtSecret: string;
    private servicePaths: typeof prodServicePaths | typeof devServicePaths

    constructor() {
        this.bookingModel = new BookingModel();
        this.jwtSecret = 'jwtSecret';
        this.servicePaths = process.env.MODE === "PRODUCTION" ? prodServicePaths : devServicePaths;
    }

    async createBooking(req: Request<any, any, ICreateBookingreqBody>, res: Response<IResponse>) {
        try {
            const {
                hotel_id,
                room_id,
                room_price
            } = req.body;

            const token = req.cookies['session_id'];
            const payload = jwt.verify(token, this.jwtSecret) as any;
            const {id: user_id} = payload;

            // 0) проверить что эта комната не забронирована
            const getRoomResult = await axios.get<IServiceResponse<{room: IRoomModel, message?: any;}>>(
                `${this.servicePaths.hotel}/api/v1/hotels/${hotel_id}/rooms/${room_id}`,
                {
                    headers: {
                        Cookie: req.headers.cookie
                    }
                }
            );

            switch (getRoomResult.data.code) {
                case '404':
                case '500':
                    res.status(200).json({
                        code: getRoomResult.data.code,
                        body: {
                            message: getRoomResult.data.body.message
                        }
                    });
                    return;
            }

            const {data: {body: {room: {room_status}}}} = getRoomResult

            if (room_status === RoomStatuses.BOOKED) {
                res.status(200).json({
                    code: '409',
                    body: {
                        message: 'This room is already booked'
                    }
                });
                return;
            }

            // 1) сходить в сервис отелей и забукать номер
            const bookRoomResult = await axios.post<IServiceResponse<{room: IRoomModel, message?: any;}>>(
                `${this.servicePaths.hotel}/api/v1/hotels/${hotel_id}/rooms/${room_id}`,
                {
                    room_status: RoomStatuses.BOOKED
                }
            );

            // 2) сходить в сервис оплат и создать оплату
            const createPaymentResult = await axios.post<IServiceResponse<{payment: IPaymentModel, message?: any;}>>(
                `${this.servicePaths.payment}/api/v1/payment/create`,
                {
                    price: room_price
                },
                {
                    headers: {
                        Cookie: req.headers.cookie
                    }
                }
            );

            switch (createPaymentResult.data.code) {
                case '404':
                case '500':
                    res.status(200).json({
                        code: createPaymentResult.data.code,
                        body: {
                            message: bookRoomResult.data.body.message
                        }
                    });
                    return;
            }

            // 3) создаем бронь
            const booking = await this.bookingModel.createBooking({
                hotel_id, 
                room_id,
                user_id,
                payment_id: createPaymentResult.data.body.payment.id
            });
            res.status(200).json({
                code: "200",
                body: {
                    booking
                }
            });
        } catch (error) {
            res.status(200).json({
                code: "500",
                body: {
                    message: error
                }
            });
        }
    }

    async getBookings(req: Request, res: Response<IResponse>) {
        try {
            const token = req.cookies['session_id'];
            const payload = jwt.verify(token, this.jwtSecret) as any;
    
            const {id: userId} = payload;
            const {bookings} = await this.bookingModel.getBookings(userId);

            const bookingsPromise = new Promise((resolve, reject) => {
                const bookingsArray: IBookingWithContentModel[] = []
                const bookingsLen = bookings.length;
                let resolvedBookings = 0
                if (bookings.length === 0) {
                    resolve(bookingsArray);
                }
                for (let i = 0; i < bookingsLen; i++) {
                    const paymentPromise = axios.get<IServiceResponse<{payment: IPaymentModel, message?: any;}>>(
                        `${this.servicePaths.payment}/api/v1/payment/${bookings[i].payment_id}`,
                        {
                            headers: {
                                Cookie: req.headers.cookie
                            }
                        }
                    );
    
                    const hotelPromise = axios.get<IServiceResponse<{hotel: IHotelModel, message?: any;}>>(
                        `${this.servicePaths.hotel}/api/v1/hotels/${bookings[i].hotel_id}`,
                        {
                            headers: {
                                Cookie: req.headers.cookie
                            }
                        }
                    );
    
                    const roomPromise = axios.get<IServiceResponse<{room: IRoomModel, message?: any;}>>(
                        `${this.servicePaths.hotel}/api/v1/hotels/${bookings[i].hotel_id}/rooms/${bookings[i].room_id}`,
                        {
                            headers: {
                                Cookie: req.headers.cookie
                            }
                        }
                    );
    
                    Promise.all([paymentPromise, hotelPromise, roomPromise])
                        .then((data) => {
                            bookingsArray.push({
                                ...bookings[i],
                                hotel_title: data[1].data.body.hotel.title,
                                hotel_city: data[1].data.body.hotel.city,
                                hotel_address: data[1].data.body.hotel.hotel_address,
                                room_number: data[2].data.body.room.room_number,
                                room_status: data[2].data.body.room.room_status,
                                room_cost: data[0].data.body.payment.price,
                                payment_status: data[0].data.body.payment.payment_status
                            });
                            resolvedBookings++;

                            if (resolvedBookings === bookingsLen) {
                                resolve(bookingsArray) 
                            }
                        });
                }
            })
            
            const resultBookings = await bookingsPromise;

            res.status(200).json({
                code: "200",
                body: {
                    bookings: resultBookings
                }
            });
        } catch (error) {
            res.status(200).json({
                code: "500",
                body: {
                    message: error
                }
            });
        }
    }

    async getBooking(req: Request<IGetBookingReqParams>, res: Response<IResponse>) {
        try {
            const token = req.cookies['session_id'];
            const payload = jwt.verify(token, this.jwtSecret) as any;
            const {id: userId} = payload;
            const {id} = req.params;
            const {booking} = await this.bookingModel.getBooking(userId, id);
            if (booking) {
                const {data: {body: {payment}}} = await axios.get<IServiceResponse<{payment: IPaymentModel, message?: any;}>>(
                    `${this.servicePaths.payment}/api/v1/payment/${booking.payment_id}`,
                    {
                        headers: {
                            Cookie: req.headers.cookie
                        }
                    }
                );

                const {data: {body: {hotel}}} = await axios.get<IServiceResponse<{hotel: IHotelModel, message?: any;}>>(
                    `${this.servicePaths.hotel}/api/v1/hotels/${booking.hotel_id}`,
                    {
                        headers: {
                            Cookie: req.headers.cookie
                        }
                    }
                );

                const {data: {body: {room}}} = await axios.get<IServiceResponse<{room: IRoomModel, message?: any;}>>(
                    `${this.servicePaths.hotel}/api/v1/hotels/${booking.hotel_id}/rooms/${booking.room_id}`,
                    {
                        headers: {
                            Cookie: req.headers.cookie
                        }
                    }
                );

                res.status(200).json({
                    code: "200",
                    body: {
                        booking: {
                            ...booking,
                            hotel_title: hotel.title,
                            hotel_city: hotel.city,
                            hotel_address: hotel.hotel_address,
                            room_number: room.room_number,
                            room_status: room.room_status,
                            room_cost: payment.price,
                            payment_status: payment.payment_status 
                        }
                    }
                });
            } else {
                res.status(200).json({
                    code: "404",
                    body: {
                        message: 'Booking not found'
                    }
                });
            }
        } catch (error) {
            res.status(200).json({
                code: "500",
                body: {
                    message: error
                }
            });
        }
    }

    async payBooking(req: Request<IPayBookingReqParams>, res: Response<IResponse>) {
        try {
            // 1) проверяем что бронь вообще есть
            const token = req.cookies['session_id'];
            const payload = jwt.verify(token, this.jwtSecret) as any;
            const {id: userId} = payload;
            const {id} = req.params;
            const {booking} = await this.bookingModel.getBooking(userId, id);
            const {bookings} = await this.bookingModel.getBookings(userId);

            if (booking) {
                // 2) ставим статус оплачено
                const {data: {body: {payment}}} = await axios.post<IServiceResponse<{payment: IPaymentModel, message?: any;}>>(
                    `${this.servicePaths.payment}/api/v1/payment/pay/${booking.payment_id}`,
                    {},
                    {
                        headers: {
                            Cookie: req.headers.cookie
                        }
                    }
                );

                // 3) обновляем лояльность
                await axios.patch<IServiceResponse<{loyalty: ILoyaltyModel, message?: any;}>>(
                    `${this.servicePaths.loyalty}/api/v1/loyalty`,
                    {
                        bookingsCount: bookings.length,
                    },
                    {
                        headers: {
                            Cookie: req.headers.cookie
                        }
                    }
                );

                res.status(200).json({
                    code: "200",
                    body: {
                        booking: {
                            ...booking,
                            payment_status: payment.payment_status
                        }
                    }
                });
            } else {
                res.status(200).json({
                    code: "404",
                    body: {
                        message: 'Booking not found'
                    }
                });
            }

        } catch (error) {
            res.status(200).json({
                code: "500",
                body: {
                    message: error
                }
            });
        }
    }

    async reverseBooking(req: Request<IReverseBookingReqParams>, res: Response<IResponse>) {
        try {
            // 1) проверяем что бронь вообще есть
            const token = req.cookies['session_id'];
            const payload = jwt.verify(token, this.jwtSecret) as any;
            const {id: userId} = payload;
            const {id} = req.params;
            const {booking} = await this.bookingModel.getBooking(userId, id);

            if (booking) {
                // 2) ставим статус что бронь отменена после оплаты с возвратом денег
                const {data: {body: {payment}, code}} = await axios.post<IServiceResponse<{payment: IPaymentModel, message?: any;}>>(
                    `${this.servicePaths.payment}/api/v1/payment/reverse/${booking.payment_id}`,
                    {},
                    {
                        headers: {
                            Cookie: req.headers.cookie
                        }
                    }
                );

                if (code === "500") {
                    res.status(200).json({
                        code: "500",
                        body: {
                            message: "Cannot reverse payment"
                        }
                    });
                    return;
                }

                // 3) делаем доступным номер в отеле
                const hotel = await axios.post<IServiceResponse<{payment: IPaymentModel, message?: any;}>>(
                    `${this.servicePaths.hotel}/api/v1/hotels/${booking.hotel_id}/rooms/${booking.room_id}`,
                    {
                        room_status: RoomStatuses.AVALIABLE
                    }
                );

                if (hotel.data.code === "500") {
                    res.status(200).json({
                        code: "500",
                        body: {
                            message: "Hotel cannot be unbooked"
                        }
                    });
                    return;
                }
                
                res.status(200).json({
                    code: "200",
                    body: {
                        booking: {
                            ...booking,
                            payment_status: payment.payment_status
                        }
                    }
                });
            } else {
                res.status(200).json({
                    code: "404",
                    body: {
                        message: 'Booking not found'
                    }
                });
            }

        } catch (error) {
            res.status(200).json({
                code: "500",
                body: {
                    message: error
                }
            });
        }
    }

    async cancelBooking(req: Request<ICancelBookingReqParams>, res: Response<IResponse>) {
        try {
            // 1) проверяем что бронь вообще есть
            const token = req.cookies['session_id'];
            const payload = jwt.verify(token, this.jwtSecret) as any;
            const {id: userId} = payload;
            const {id} = req.params;
            const {booking} = await this.bookingModel.getBooking(userId, id);

            if (booking) {
                // 2) ставим статуc что бронь отменена до оплаты
                const {data: {body: {payment}, code}} = await axios.post<IServiceResponse<{payment: IPaymentModel, message?: any;}>>(
                    `${this.servicePaths.payment}/api/v1/payment/cancel/${booking.payment_id}`,
                    {},
                    {
                        headers: {
                            Cookie: req.headers.cookie
                        }
                    }
                );

                if (code === "500") {
                    res.status(200).json({
                        code: "500",
                        body: {
                            message: "Cannot cancel payment"
                        }
                    });
                    return;
                }

                // 3) делаем доступным номер в отеле
                const hotel = await axios.post<IServiceResponse<{payment: IPaymentModel, message?: any;}>>(
                    `${this.servicePaths.hotel}/api/v1/hotels/${booking.hotel_id}/rooms/${booking.room_id}`,
                    {
                        room_status: RoomStatuses.AVALIABLE
                    }
                );

                if (hotel.data.code === "500") {
                    res.status(200).json({
                        code: "500",
                        body: {
                            message: "Hotel cannot be unbooked"
                        }
                    });
                    return;
                }
                
                res.status(200).json({
                    code: "200",
                    body: {
                        booking: {
                            ...booking,
                            payment_status: payment.payment_status
                        }
                    }
                });
            } else {
                res.status(200).json({
                    code: "404",
                    body: {
                        message: 'Booking not found'
                    }
                });
            }

        } catch (error) {
            res.status(200).json({
                code: "500",
                body: {
                    message: error
                }
            });
        }
    }

}