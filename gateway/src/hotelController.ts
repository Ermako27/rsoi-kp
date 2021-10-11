import {Request, Response} from 'express';
import axios from 'axios';
import {devServicePaths, prodServicePaths} from './interfaces/IGateway';
import {IResponse, IServiceResponse} from './interfaces/IResponse';
import {
    ICreateHotelReqBody,
    IGetHotelReqParams,
    ICreateRoomReqBody,
    ICreateRoomReqParams,
    IGetHotelRoomsReqParams,
    IGetHotelRoomReqParams
} from './interfaces/IRequest';

import {IHotelModel, IRoomModel} from './interfaces/IHotel'

export class HotelController {
    private servicePaths: typeof prodServicePaths | typeof devServicePaths
    constructor() {
        this.servicePaths = process.env.MODE === "PRODUCTION" ? prodServicePaths : devServicePaths
    }
    async addHotel(req: Request<any, any, ICreateHotelReqBody>, res: Response<IResponse>) {
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
            
        // 2) создаем отель
        const {body: hotelData} = req;
        const hotel = await axios.post<IServiceResponse<{hotel: IHotelModel, message?: string}>>(
            `${this.servicePaths.hotel}/api/v1/hotels`,
            hotelData,
            {
                headers: {
                    Cookie: req.headers.cookie
                }
            }
        );

        if (hotel.data.code !== "200") {
            res.status(200).json({
                code: hotel.data.code,
                body: {
                    message: hotel.data.body.message
                }
            });
            return;
        } else {
            res.status(200).json({
                code: "200",
                body: {
                    hotel: hotel.data.body.hotel
                }
            });
        }
    }

    async getHotels(req: Request, res: Response<IResponse>) {

        const options = req.headers.cookie ? {headers: {Cookie: req.headers.cookie}} : {headers:{}}

        // 2) получаем отели
        const hotels = await axios.get<IServiceResponse<{hotels: IHotelModel[], message?: string}>>(
            `${this.servicePaths.hotel}/api/v1/hotels`,
            options
        );

        if (hotels.data.code !== "200") {
            res.status(200).json({
                code: hotels.data.code,
                body: {
                    message: hotels.data.body.message
                }
            });
            return;
        } else {
            res.status(200).json({
                code: "200",
                body: {
                    hotels: hotels.data.body.hotels
                }
            });
        }

    }

    async getHotel(req: Request<IGetHotelReqParams>, res: Response<IResponse>) {

        // 2) получаем отель
        const {id} = req.params
        const options = req.headers.cookie ? {headers: {Cookie: req.headers.cookie}} : {headers:{}}
        const hotel = await axios.get<IServiceResponse<{hotel: IHotelModel, message?: string}>>(
            `${this.servicePaths.hotel}/api/v1/hotels/${id}`,
            options
        );

        if (hotel.data.code !== "200") {
            res.status(200).json({
                code: hotel.data.code,
                body: {
                    message: hotel.data.body.message
                }
            });
            return;
        } else {
            res.status(200).json({
                code: "200",
                body: {
                    hotel: hotel.data.body.hotel
                }
            });
        }
    }

    async addRoom(req: Request<ICreateRoomReqParams, any, ICreateRoomReqBody>, res: Response<IResponse>) {
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

        // 2) создаем комнату в отеле
        const {body: roomData} = req;
        const {hotel_id} = req.params
        const room = await axios.post<IServiceResponse<{room: IRoomModel, message?: string}>>(
            `${this.servicePaths.hotel}/api/v1/hotels/${hotel_id}/rooms`,
            roomData,
            {
                headers: {
                    Cookie: req.headers.cookie
                }
            }
        );

        if (room.data.code !== "200") {
            res.status(200).json({
                code: room.data.code,
                body: {
                    message: room.data.body.message
                }
            });
            return;
        } else {
            res.status(200).json({
                code: "200",
                body: {
                    room: room.data.body.room
                }
            });
        }
    }

    async getHotelRooms(req: Request<IGetHotelRoomsReqParams>, res: Response<IResponse>) {
        // 2) получаем все комнаты отеля
        const {hotel_id} = req.params
        const options = req.headers.cookie ? {headers: {Cookie: req.headers.cookie}} : {headers:{}}
        const rooms = await axios.get<IServiceResponse<{rooms: IRoomModel[], message?: string}>>(
            `${this.servicePaths.hotel}/api/v1/hotels/${hotel_id}/rooms`,
            options
        );

        if (rooms.data.code !== "200") {
            res.status(200).json({
                code: rooms.data.code,
                body: {
                    message: rooms.data.body.message
                }
            });
            return;
        } else {
            res.status(200).json({
                code: "200",
                body: {
                    rooms: rooms.data.body.rooms
                }
            });
        }
    }

    async getRoom(req: Request<IGetHotelRoomReqParams>, res: Response<IResponse>) {
        // 2) получаем комнату в отеле
        const {hotel_id, room_id} = req.params
        const options = req.headers.cookie ? {headers: {Cookie: req.headers.cookie}} : {headers:{}}
        const room = await axios.get<IServiceResponse<{room: IRoomModel, message?: string}>>(
            `${this.servicePaths.hotel}/api/v1/hotels/${hotel_id}/rooms/${room_id}`,
            options
        );

        if (room.data.code !== "200") {
            res.status(200).json({
                code: room.data.code,
                body: {
                    message: room.data.body.message
                }
            });
            return;
        } else {
            res.status(200).json({
                code: "200",
                body: {
                    hotel: room.data.body.room
                }
            });
        }
    }
}