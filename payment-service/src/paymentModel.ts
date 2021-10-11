import {pool} from "./pool";
import {IPayment, PaymentStatuses} from "./interfaces/IPayment";

export class PaymentModel {
    async createPayment(price: number): Promise<IPayment> {
        return (
            await pool.query<IPayment>(
                `INSERT INTO payments (payment_status, price) VALUES ('${PaymentStatuses.NEW}',${price}) RETURNING *`,
            )
        ).rows[0];
    }

    async payPayment(id: number): Promise<IPayment> {
        return (
            await pool.query<IPayment>(
                `UPDATE payments SET payment_status='${PaymentStatuses.PAID}' WHERE id=${id} RETURNING *`,
            )
        ).rows[0];
    }

    async reversePayment(id: number): Promise<IPayment> {
        return (
            await pool.query<IPayment>(
                `UPDATE payments SET payment_status='${PaymentStatuses.REVERSED}' WHERE id=${id} RETURNING *`,
            )
        ).rows[0];
    }

    async cancelPayment(id: number): Promise<IPayment> {
        return (
            await pool.query<IPayment>(
                `UPDATE payments SET payment_status='${PaymentStatuses.CANCELED}' WHERE id=${id} RETURNING *`,
            )
        ).rows[0];

    }

    async getPayment(id: number): Promise<{payment: IPayment | undefined}> {
        const paymentData = await pool.query<IPayment>(`SELECT * FROM payments WHERE id=${id}`);
        return {
            payment: paymentData.rowCount !== 0 ? paymentData.rows[0] : undefined
        }
    }

    async deletePayment(id: number): Promise<IPayment> {
        return (
            await pool.query<IPayment>(
                `DELETE FROM payments WHERE id=${id} RETURNING *`,
            )
        ).rows[0];
    }
}