import express, {Request, Response} from 'express';
import cookieParser from 'cookie-parser';
import {BookingController} from './bookingController';
import {HotelController} from './hotelController';
import {LoyaltyController} from './loyaltyController';
import {ReportController} from './reportController';

const bookingController = new BookingController();
const hotelController = new HotelController();
const loyaltyController = new LoyaltyController();
const reportController = new ReportController()


export const app = express();

app.use(cookieParser())
app.use(express.json());

app.use(function (req, res, next) {
    //Enabling CORS 
    const origin = process.env.MODE === "PRODUCTION" ? "http://booking-ui.ru" : "http://127.0.0.1:3000"
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "OPTIONS,GET,POST,HEAD,PUT");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization, X-Token");
	res.header("Cache-control", "no-store, no-cache, must-revalidate");
	res.header("Pragma", "no-cache");
	next();
});

app.get('/', (req: Request, res: Response) => {
	res.status(200).json({message: 'health check'});
});

// BOOKING-SERVICE
app.post('/api/v1/bookings/', bookingController.createBooking.bind(bookingController));
app.get('/api/v1/bookings/', bookingController.getBookings.bind(bookingController));
app.get('/api/v1/bookings/:id', bookingController.getBooking.bind(bookingController));
app.post('/api/v1/bookings/:id/pay', bookingController.payBooking.bind(bookingController));
app.post('/api/v1/bookings/:id/reverse', bookingController.reverseBooking.bind(bookingController));
app.post('/api/v1/bookings/:id/cancel', bookingController.cancelBooking.bind(bookingController));

// HOTEL-SERVICE
app.post('/api/v1/hotels', hotelController.addHotel.bind(hotelController));
app.get('/api/v1/hotels', hotelController.getHotels.bind(hotelController));
app.get('/api/v1/hotels/:id', hotelController.getHotel.bind(hotelController));
app.post('/api/v1/hotels/:hotel_id/rooms', hotelController.addRoom.bind(hotelController));
app.get('/api/v1/hotels/:hotel_id/rooms', hotelController.getHotelRooms.bind(hotelController));
app.get('/api/v1/hotels/:hotel_id/rooms/:room_id', hotelController.getRoom.bind(hotelController));

// LOYALTY-SERVICE
app.get('/api/v1/loyalty', loyaltyController.getLoyalty.bind(loyaltyController));

// REPORTS 
app.get('/api/v1/report/booking', reportController.getUsersReport.bind(reportController));