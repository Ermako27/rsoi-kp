
import {Request, Response} from 'express';
import axios from 'axios';
import {IResponse, IServiceResponse} from './interfaces/IResponse';
import {
    ICreateBookingreqBody,
    IGetBookingReqParams,
    IPayBookingReqParams,
    IReverseBookingReqParams,
    ICancelBookingReqParams
} from './interfaces/IRequest';

import {IRoomModel, IPaymentModel, RoomStatuses, IBookingModel} from './interfaces/IBooking';
import {devServicePaths, prodServicePaths} from './interfaces/IGateway';

export class BookingController {
    private servicePaths: typeof prodServicePaths | typeof devServicePaths
    constructor() {
        this.servicePaths = process.env.MODE === "PRODUCTION" ? prodServicePaths : devServicePaths;
    }
    async createBooking(req: Request<any, any, ICreateBookingreqBody>, res: Response<IResponse>) {
        // 1) проверяем авторизацию

        if (!req.headers.cookie) {
            res.status(200).json({
                code: "401",
                body: {
                    message: 'Not authorized, no session cookie'
                }
            });
            return;
        }

        const authData = await axios.get<IServiceResponse<{message: string;}>>(
            `${this.servicePaths.session}/api/v1/verify`,
            {
                headers: {
                    Cookie: req.headers.cookie
                }
            }
        );

        if (authData.data.code !== "200") {
            res.status(200).json({
                code: authData.data.code,
                body: {
                    message: authData.data.body.message
                }
            });
            return;
        }

        // 2) создаем бронировние
        const {body: bookingData} = req
        const booking = await axios.post<IServiceResponse<{booking: IBookingModel, message?: string}>>(
            `${this.servicePaths.bookings}/api/v1/bookings`,
            bookingData,
            {
                headers: {
                    Cookie: req.headers.cookie
                }
            }
        );

        if (booking.data.code !== "200") {
            res.status(200).json({
                code: booking.data.code,
                body: {
                    message: booking.data.body.message
                }
            });
            return;
        } else {
            res.status(200).json({
                code: "200",
                body: {
                    booking: booking.data.body.booking
                }
            });
        }
    }

    async getBookings(req: Request, res: Response<IResponse>) {
        // 1) проверяем авторизацию
        if (!req.headers.cookie) {
            res.status(200).json({
                code: "401",
                body: {
                    message: 'Not authorized, no session cookie'
                }
            });
            return;
        }
        const authData = await axios.get<IServiceResponse<{message: string;}>>(
            `${this.servicePaths.session}/api/v1/verify`,
            {
                headers: {
                    Cookie: req.headers.cookie
                }
            }
        );

        if (authData.data.code !== "200") {
            res.status(200).json({
                code: authData.data.code,
                body: {
                    message: authData.data.body.message
                }
            });
            return;
        }

        // 2) получаем все бронирования пользователя
        const bookings = await axios.get<IServiceResponse<{bookings: IBookingModel[], message?: string}>>(
            `${this.servicePaths.bookings}/api/v1/bookings`,
            {
                headers: {
                    Cookie: req.headers.cookie
                }
            }
        );
        
        if (bookings.data.code !== "200") {
            res.status(200).json({
                code: bookings.data.code,
                body: {
                    message: bookings.data.body.message
                }
            });
            return;
        } else {
            res.status(200).json({
                code: "200",
                body: {
                    bookings: bookings.data.body.bookings
                }
            });
        }
    }

    async getBooking(req: Request<IGetBookingReqParams>, res: Response<IResponse>) {
        // 1) проверяем авторизацию
        if (!req.headers.cookie) {
            res.status(200).json({
                code: "401",
                body: {
                    message: 'Not authorized, no session cookie'
                }
            });
            return;
        }
        const authData = await axios.get<IServiceResponse<{message: string;}>>(
            `${this.servicePaths.session}/api/v1/verify`,
            {
                headers: {
                    Cookie: req.headers.cookie
                }
            }
        );

        if (authData.data.code !== "200") {
            res.status(200).json({
                code: authData.data.code,
                body: {
                    message: authData.data.body.message
                }
            });
            return;
        }

        // 2) получаем одно бронирование пользователя
        const {id} = req.params
        const booking = await axios.get<IServiceResponse<{booking: IBookingModel, message?: string}>>(
            `${this.servicePaths.bookings}/api/v1/bookings/${id}`,
            {
                headers: {
                    Cookie: req.headers.cookie
                }
            }
        );
        
        if (booking.data.code !== "200") {
            res.status(200).json({
                code: booking.data.code,
                body: {
                    message: booking.data.body.message
                }
            });
            return;
        } else {
            res.status(200).json({
                code: "200",
                body: {
                    booking: booking.data.body.booking
                }
            });
        }
    }

    async payBooking(req: Request<IPayBookingReqParams>, res: Response<IResponse>) {
        // 1) проверяем авторизацию
        if (!req.headers.cookie) {
            res.status(200).json({
                code: "401",
                body: {
                    message: 'Not authorized, no session cookie'
                }
            });
            return;
        }
        const authData = await axios.get<IServiceResponse<{message: string;}>>(
            `${this.servicePaths.session}/api/v1/verify`,
            {
                headers: {
                    Cookie: req.headers.cookie
                }
            }
        );

        if (authData.data.code !== "200") {
            res.status(200).json({
                code: authData.data.code,
                body: {
                    message: authData.data.body.message
                }
            });
            return;
        }

        // 2) оплачиваем бронирование
        const {id} = req.params
        const payedBooking = await axios.post<IServiceResponse<{booking: IBookingModel, message?: string}>>(
            `${this.servicePaths.bookings}/api/v1/bookings/${id}/pay`,
            {},
            {
                headers: {
                    Cookie: req.headers.cookie
                }
            }
        );
        
        if (payedBooking.data.code !== "200") {
            res.status(200).json({
                code: payedBooking.data.code,
                body: {
                    message: payedBooking.data.body.message
                }
            });
            return;
        } else {
            res.status(200).json({
                code: "200",
                body: {
                    booking: payedBooking.data.body.booking
                }
            });
        }
    }
    
    async reverseBooking(req: Request<IReverseBookingReqParams>, res: Response<IResponse>) {
        // 1) проверяем авторизацию
        if (!req.headers.cookie) {
            res.status(200).json({
                code: "401",
                body: {
                    message: 'Not authorized, no session cookie'
                }
            });
            return;
        }
        const authData = await axios.get<IServiceResponse<{message: string;}>>(
            `${this.servicePaths.session}/api/v1/verify`,
            {
                headers: {
                    Cookie: req.headers.cookie
                }
            }
        );

        if (authData.data.code !== "200") {
            res.status(200).json({
                code: authData.data.code,
                body: {
                    message: authData.data.body.message
                }
            });
            return;
        }

        // 2) отменяем после оплаты (возвращаем деньги)
        const {id} = req.params
        const reversedBooking = await axios.post<IServiceResponse<{booking: IBookingModel, message?: string}>>(
            `${this.servicePaths.bookings}/api/v1/bookings/${id}/reverse`,
            {},
            {
                headers: {
                    Cookie: req.headers.cookie
                }
            }
        );
        
        if (reversedBooking.data.code !== "200") {
            res.status(200).json({
                code: reversedBooking.data.code,
                body: {
                    message: reversedBooking.data.body.message
                }
            });
            return;
        } else {
            res.status(200).json({
                code: "200",
                body: {
                    booking: reversedBooking.data.body.booking
                }
            });
        }
    }

    async cancelBooking(req: Request<ICancelBookingReqParams>, res: Response<IResponse>) {
        // 1) проверяем авторизацию
        if (!req.headers.cookie) {
            res.status(200).json({
                code: "401",
                body: {
                    message: 'Not authorized, no session cookie'
                }
            });
            return;
        }
        const authData = await axios.get<IServiceResponse<{message: string;}>>(
            `${this.servicePaths.session}/api/v1/verify`,
            {
                headers: {
                    Cookie: req.headers.cookie
                }
            }
        );

        if (authData.data.code !== "200") {
            res.status(200).json({
                code: authData.data.code,
                body: {
                    message: authData.data.body.message
                }
            });
            return;
        }

        // 2) отменяем после оплаты (возвращаем деньги)
        const {id} = req.params
        const canceledBooking = await axios.post<IServiceResponse<{booking: IBookingModel, message?: string}>>(
            `${this.servicePaths.bookings}/api/v1/bookings/${id}/cancel`,
            {},
            {
                headers: {
                    Cookie: req.headers.cookie
                }
            }
        );
        
        if (canceledBooking.data.code !== "200") {
            res.status(200).json({
                code: canceledBooking.data.code,
                body: {
                    message: canceledBooking.data.body.message
                }
            });
            return;
        } else {
            res.status(200).json({
                code: "200",
                body: {
                    booking: canceledBooking.data.body.booking
                }
            });
        }
    }
}