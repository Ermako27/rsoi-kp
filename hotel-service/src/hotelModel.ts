import {pool} from './pool';

import {IHotelModel, IRoomModel, RoomStatuses} from './interfaces/IHotel';
import {ICreateHotelReqBody, ICreateRoomReqBody} from './interfaces/IRequest';

export class HotelModel {
    // COMMON
    async getHotels(): Promise<{hotels: IHotelModel[]}> {
        const hotels = (await pool.query<IHotelModel>('SELECT * FROM hotels')).rows;
        return {hotels};
    }

    // COMMON
    async getHotel(id: number): Promise<{hotel:IHotelModel | undefined}> {
        const hotelData = (await pool.query<IHotelModel>(`SELECT * FROM hotels WHERE id=${id}`));
        if (hotelData.rowCount === 0) {
            return {
                hotel: undefined
            } 
        }
        return {
            hotel: hotelData.rows[0]
        };
    }

    // ADMIN
    async addHotel(payload: ICreateHotelReqBody): Promise<{hotel: IHotelModel}> {
        const {
            title,
            city,
            hotel_address,
            rooms_count,
        } = payload;

        const hotel = (await pool.query<IHotelModel>(
            `INSERT INTO hotels (title, city, hotel_address, rooms_count) VALUES ('${title}','${city}','${hotel_address}',${rooms_count}) RETURNING *`,
        )).rows[0]

        return {
            hotel
        }
    }

    // COMMON
    async getHotelRooms(hotelId: number): Promise<{rooms: IRoomModel[]}> {
        const roomsData = (await pool.query<IRoomModel>(`SELECT * FROM rooms WHERE hotel_id=${hotelId}`));
        return {
            rooms: roomsData.rows
        }
    }

    // COMMON
    async getHotelRoom(roomId: number, hotelId: number): Promise<{room: IRoomModel | undefined}>  {
        const roomData = (await pool.query<IRoomModel>(`SELECT * FROM rooms WHERE id=${roomId} AND hotel_id=${hotelId}`));
        if (roomData.rowCount === 0) {
            return {
                room: undefined
            };
        }
        return {
            room: roomData.rows[0]
        };
    }

    // ADMIN
    async addRoom(hotelId: number, payload: ICreateRoomReqBody): Promise<IRoomModel> {
        const room = (await pool.query<IRoomModel>(
            `INSERT INTO rooms (hotel_id, room_number, room_status, room_cost) VALUES (${hotelId},${payload.room_number},'${payload.room_status}',${payload.room_cost}) RETURNING *`,
        )).rows[0];

        return room;
    }

    // COMMON
    async changeRoomStatus(roomId: number, hotelId: number, roomStatus: string): Promise<IRoomModel> {
        const room = (await pool.query<IRoomModel>(
            `UPDATE rooms SET room_status='${roomStatus}' WHERE id=${roomId} AND hotel_id=${hotelId} RETURNING *`,
        )).rows[0];
        return room
    }
}
