import {pool} from "./pool";
import {IBookingData, IBookingModel} from "./interfaces/IBooking";

export class BookingModel {
    async createBooking(payload: IBookingData): Promise<IBookingModel> {
        const {
            hotel_id,
            room_id,
            user_id,
            payment_id
        } = payload
        return (
            await pool.query<IBookingModel>(
                `INSERT INTO bookings (hotel_id, room_id, "user_id", payment_id) VALUES (${hotel_id},${room_id},${user_id},${payment_id}) RETURNING *`,
            )
        ).rows[0];
    }

    async getBookings(userId: number): Promise<{bookings: IBookingModel[]}>{
        const bookingsData = await pool.query<IBookingModel>(`SELECT * FROM bookings WHERE user_id=${userId}`);

        return {
            bookings: bookingsData.rows
        }
    }

    async getBooking(userId: number, bookingId: number): Promise<{booking: IBookingModel | undefined}>{
        const bookingsData = await pool.query<IBookingModel>(`SELECT * FROM bookings WHERE user_id=${userId} AND id=${bookingId}`);
        if (bookingsData.rowCount === 0) {
            return {
                booking: undefined
            }
        }
        return {
            booking: bookingsData.rows[0]
        }
    }
}
