import {Request, Response} from 'express';
import {IResponse} from './interfaces/IResponse';
import {ICreatePaymentReqBody, IChangePaymentStatusParams, IDeletePaymetParams, ICreateReportRecordReqParams} from './interfaces/IRequest';
import {PaymentModel} from './paymentModel';
import {ReportModel} from './reportModel';
import jwt from 'jsonwebtoken';

enum Roles {
    COMMON = 'COMMON',
    ADMIN = 'ADMIN'
}

export class PaymentController {
    private paymentModel: PaymentModel;
    private reportModel: ReportModel;
    private jwtSecret: string;
    constructor() {
        this.paymentModel = new PaymentModel();
        this.reportModel = new ReportModel();
        this.jwtSecret = 'jwtSecret';
    }

    async createPayment(req: Request<any, any, ICreatePaymentReqBody>, res: Response<IResponse>) {
        const {price} = req.body;

        const token = req.cookies['session_id'];
        const payload = jwt.verify(token, this.jwtSecret) as any;
        const {id: userId} = payload;

        try {
            const payment = await this.paymentModel.createPayment(price);
            await this.reportModel.createPayment(userId);
            res.status(200).json({
                code: "200",
                body: {
                    payment
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

    async payPayment(req: Request<IChangePaymentStatusParams>, res: Response<IResponse>) {
        try {
            const {id} = req.params;

            const token = req.cookies['session_id'];
            const payload = jwt.verify(token, this.jwtSecret) as any;
            const {id: userId} = payload;

            const payment = await this.paymentModel.payPayment(id);
            await this.reportModel.payPayment(userId);

            res.status(200).json({
                code: "200",
                body: {
                    payment
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

    async reversePayment(req: Request<IChangePaymentStatusParams>, res: Response<IResponse>) {
        try {
            const {id} = req.params;

            const token = req.cookies['session_id'];
            const payload = jwt.verify(token, this.jwtSecret) as any;
            const {id: userId} = payload;

            const payment = await this.paymentModel.reversePayment(id);
            await this.reportModel.reversePayment(userId);

            res.status(200).json({
                code: "200",
                body: {
                    payment
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

    async cancelPayment(req: Request<IChangePaymentStatusParams>, res: Response<IResponse>) {
        try {
            const {id} = req.params;

            const token = req.cookies['session_id'];
            const payload = jwt.verify(token, this.jwtSecret) as any;
            const {id: userId} = payload;

            const payment = await this.paymentModel.cancelPayment(id);
            await this.reportModel.cancelPayment(userId);

            res.status(200).json({
                code: "200",
                body: {
                    payment
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

    async getReport(req: Request, res: Response<IResponse>) {
        console.log('paymentController getReport')
        try {
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

            const {report} = await this.reportModel.getReport();
            res.status(200).json({
                code: "200",
                body: {
                    report
                }
            });
        } catch(error) {
            res.status(200).json({
                code: "500",
                body: {
                    message: error
                }
            });
        }
    }

    async createReportRecord(req: Request<any, any, ICreateReportRecordReqParams>, res: Response<IResponse>) {
        try {
            const {user_id, username} = req.body
            const report = await this.reportModel.createReportRecord(user_id, username);

            res.status(200).json({
                code: "200",
                body: {
                    report
                }
            });
        } catch(error) {
            res.status(200).json({
                code: "500",
                body: {
                    message: error
                }
            });
        }
    }

    async getPayment(req: Request<IChangePaymentStatusParams>, res: Response<IResponse>) {
        try {
            const {id} = req.params;
            const {payment} = await this.paymentModel.getPayment(id);

            if (payment) {
                res.status(200).json({
                    code: "200",
                    body: {
                        payment
                    }
                });
            } else {
                res.status(200).json({
                    code: "404",
                    body: {
                        message: 'Payment not found'
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

    async deletePayment(req: Request<IDeletePaymetParams>, res: Response<IResponse>) {
        try {
            const {id} = req.params;
            const payment = await this.paymentModel.deletePayment(id);
            res.status(200).json({
                code: "200",
                body: {
                    payment
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
}