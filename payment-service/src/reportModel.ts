import {pool} from "./pool";
import {IPaymentReport} from "./interfaces/IReport";

export class ReportModel {
    async createReportRecord(userId: number, userName: string): Promise<IPaymentReport> {
        return (
            await pool.query<IPaymentReport>(
                `INSERT INTO payments_stats ("user_id", username, total_count, unpaid, paid, reversed, canceled) VALUES (${userId},'${userName}',0,0,0,0,0) RETURNING *`,
            )
        ).rows[0];
    }

    async createPayment(userId: number): Promise<IPaymentReport> {
        return (
            await pool.query<IPaymentReport>(
                `UPDATE payments_stats SET unpaid=unpaid+1, total_count=total_count+1 WHERE user_id=${userId} RETURNING *`,
            )
        ).rows[0];
    }

    async payPayment(userId: number): Promise<IPaymentReport> {
        return (
            await pool.query<IPaymentReport>(
                `UPDATE payments_stats SET unpaid=unpaid-1, paid=paid+1 WHERE user_id=${userId} RETURNING *`,
            )
        ).rows[0];
    }

    async reversePayment(userId: number): Promise<IPaymentReport> {
        return (
            await pool.query<IPaymentReport>(
                `UPDATE payments_stats SET paid=paid-1, reversed=reversed+1 WHERE user_id=${userId} RETURNING *`,
            )
        ).rows[0];
    }

    async cancelPayment(userId: number): Promise<IPaymentReport> {
        return (
            await pool.query<IPaymentReport>(
                `UPDATE payments_stats SET unpaid=unpaid-1, canceled=canceled+1 WHERE user_id=${userId} RETURNING *`,
            )
        ).rows[0];
    }

    async getReport(): Promise<{report: IPaymentReport[]}> {
        const report = await pool.query<IPaymentReport>(`SELECT * FROM payments_stats`);
        return {
            report: report.rows
        }
    }
}