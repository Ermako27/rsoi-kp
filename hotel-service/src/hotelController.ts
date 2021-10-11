import {Request, Response} from 'express';
import {IServiceResponse, IResponse} from './interfaces/IResponse';
import {
    ICreateHotelReqBody,
    IGetHotelReqParams,
    ICreateRoomReqBody,
    ICreateRoomReqParams,
    IGetHotelRoomsReqParams,
    IGetHotelRoomReqParams,
    IChangeRoomStatusReqBody,
    IChangeRoomStatusReqParams
} from './interfaces/IRequest';
import {HotelModel} from './hotelModel';
import {devServicePaths, prodServicePaths, ILoyaltyModel} from './interfaces/IHotel';
import jwt from 'jsonwebtoken';
import axios from 'axios';

enum Roles {
    COMMON = 'COMMON',
    ADMIN = 'ADMIN'
}

export class HotelController {
    private jwtSecret: string;
    private hotelModel: HotelModel;
    private servicePaths: typeof prodServicePaths | typeof devServicePaths

    constructor() {
        this.hotelModel = new HotelModel();
        this.jwtSecret = 'jwtSecret';
        this.servicePaths = process.env.MODE === "PRODUCTION" ? prodServicePaths : devServicePaths;
    }

    async addHotel(req: Request<any, any, ICreateHotelReqBody>, res: Response<IResponse>) {
        const token = req.cookies['session_id'];
        const payload = jwt.verify(token, this.jwtSecret) as any;
        
        const {role} = payload;

        if (role !== Roles.ADMIN) {
            res.status(200).json({
                code: "403",
                body: {
                    message: 'Not admin role. Forbidden',
                }
            });
            return;
        }

        try {
            const {body} = req;
            const {hotel} = await this.hotelModel.addHotel(body); 
            res.status(200).json({
                code: "200",
                body: {
                    hotel
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

    async getHotels(req: Request, res: Response<IResponse>) {
        try {
            const {hotels} = await this.hotelModel.getHotels();
            res.status(200).json({
                code: "200",
                body: {
                    hotels
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

    async getHotel(req: Request<IGetHotelReqParams>, res: Response<IResponse>) {
        try {
            const {id} = req.params;
            const hotelData = await this.hotelModel.getHotel(id);
            const {hotel} = hotelData;
            if (hotel) {
                res.status(200).json({
                    code: "200",
                    body: {
                        hotel
                    }
                });
            } else {
                res.status(200).json({
                    code: "404",
                    body: {
                        message: 'Hotel not found'
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

    async addRoom(req: Request<ICreateRoomReqParams, any, ICreateRoomReqBody>, res: Response<IResponse>) {
        const token = req.cookies['session_id'];
        const payload = jwt.verify(token, this.jwtSecret) as any;
        
        const {role} = payload;

        if (role !== Roles.ADMIN) {
            res.status(200).json({
                code: "403",
                body: {
                    message: 'Not admin role. Forbidden',
                }
            });
            return;
        }

        try {
            const {body} = req;
            const {hotel_id} = req.params;
            const room = await this.hotelModel.addRoom(hotel_id, body); 
            res.status(200).json({
                code: "200",
                body: {
                    room
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

    async getHotelRooms(req: Request<IGetHotelRoomsReqParams>, res: Response<IResponse>) {
        try {
            const {hotel_id} = req.params;

            const {hotel} = await this.hotelModel.getHotel(hotel_id);
            if (hotel) {
                let {rooms} = await this.hotelModel.getHotelRooms(hotel_id);

                // достаем лояльность пользователя
                if (req.headers.cookie) {
                    const loyalty = await axios.get<IServiceResponse<{loyalty: ILoyaltyModel, message?: any;}>>(
                        `${this.servicePaths.loyalty}/api/v1/loyalty`,
                        {
                            headers: {
                                Cookie: req.headers.cookie
                            }
                        }
                    );
    
                    const {data: {body: {loyalty: {discount}}}} = loyalty
    
                    if (discount !== 0) {
                        rooms = rooms.map((room) => {
                            const {room_cost: cost} = room;
                            room.room_cost = cost - ((cost / 100) * discount);
                            return room;
                        })
                    }
                }
    
                res.status(200).json({
                    code: "200",
                    body: {
                        rooms
                    }
                });
            } else {
                res.status(200).json({
                    code: "404",
                    body: {
                        message: 'Hotel not found'
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
    
    async getRoom(req: Request<IGetHotelRoomReqParams>, res: Response<IResponse>) {
        try {
            const {hotel_id, room_id} = req.params;

            const {hotel} = await this.hotelModel.getHotel(hotel_id);
            if (hotel) {
                let {room} = await this.hotelModel.getHotelRoom(room_id, hotel_id);
                if (room) {
                    // достаем лояльность пользователя
                    if (req.headers.cookie) {
                        // достаем лояльность пользователя
                        const loyalty = await axios.get<IServiceResponse<{loyalty: ILoyaltyModel, message?: any;}>>(
                            `${this.servicePaths.loyalty}/api/v1/loyalty`,
                            {
                                headers: {
                                    Cookie: req.headers.cookie
                                }
                            }
                        );

                        const {data: {body: {loyalty: {discount}}}} = loyalty

                        if (discount !== 0) {
                            const {room_cost: cost} = room;
                            room.room_cost = cost - ((cost / 100) * discount);
                        }   
                    }

                    res.status(200).json({
                        code: "200",
                        body: {
                            room
                        }
                    });
                } else {
                    res.status(200).json({
                        code: "404",
                        body: {
                            message: 'Room not found'
                        }
                    });
                }
            } else {
                res.status(200).json({
                    code: "404",
                    body: {
                        message: 'Hotel not found'
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

    async changeRoomStatus(req: Request<IChangeRoomStatusReqParams, any, IChangeRoomStatusReqBody>, res: Response<IResponse>) {
        try {
            const {hotel_id, room_id} = req.params;
            const {room_status} = req.body;

            const {hotel} = await this.hotelModel.getHotel(hotel_id);
            
            if (hotel) {
                const {room} = await this.hotelModel.getHotelRoom(room_id, hotel_id);

                if (room) {
                    const bookedRoom = await this.hotelModel.changeRoomStatus(room_id, hotel_id, room_status);
                    res.status(200).json({
                        code: "200",
                        body: {
                            bookedRoom
                        }
                    });
                } else {
                    res.status(200).json({
                        code: "404",
                        body: {
                            message: 'Room not found'
                        }
                    });
                }
            } else {
                res.status(200).json({
                    code: "404",
                    body: {
                        message: 'Hotel not found'
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
