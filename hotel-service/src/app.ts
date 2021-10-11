import express, {Request, Response} from 'express';
import cookieParser from 'cookie-parser';
import {HotelController} from './hotelController';

const controller = new HotelController();

export const app = express();

app.use(cookieParser())
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.status(200).json({message: 'health check'});
});

app.post('/api/v1/hotels', controller.addHotel.bind(controller));
app.get('/api/v1/hotels', controller.getHotels.bind(controller));
app.get('/api/v1/hotels/:id', controller.getHotel.bind(controller));
app.post('/api/v1/hotels/:hotel_id/rooms', controller.addRoom.bind(controller));
app.get('/api/v1/hotels/:hotel_id/rooms', controller.getHotelRooms.bind(controller));
app.get('/api/v1/hotels/:hotel_id/rooms/:room_id', controller.getRoom.bind(controller));
app.post('/api/v1/hotels/:hotel_id/rooms/:room_id', controller.changeRoomStatus.bind(controller));