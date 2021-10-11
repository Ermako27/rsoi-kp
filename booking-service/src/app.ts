import express, {Request, Response} from 'express';
import cookieParser from 'cookie-parser';
import {BookingController} from './bookingController';

const controller = new BookingController();

export const app = express();

app.use(cookieParser())
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.status(200).json({message: 'health check'});
});

app.post('/api/v1/bookings/', controller.createBooking.bind(controller));
app.get('/api/v1/bookings/', controller.getBookings.bind(controller));
app.get('/api/v1/bookings/:id', controller.getBooking.bind(controller));
app.post('/api/v1/bookings/:id/pay', controller.payBooking.bind(controller));
app.post('/api/v1/bookings/:id/reverse', controller.reverseBooking.bind(controller));
app.post('/api/v1/bookings/:id/cancel', controller.cancelBooking.bind(controller));
