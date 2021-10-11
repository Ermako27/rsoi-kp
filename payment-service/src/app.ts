import express, {Request, Response} from 'express';
import cookieParser from 'cookie-parser';
import {PaymentController} from './paymentController';
const controller = new PaymentController();

export const app = express();

app.use(cookieParser())
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.status(200).json({message: 'health check'});
});

app.get('/api/v1/payment/report', controller.getReport.bind(controller));
app.post('/api/v1/payment/report', controller.createReportRecord.bind(controller));

app.get('/api/v1/payment/:id', controller.getPayment.bind(controller));
app.delete('/api/v1/payment/:id', controller.deletePayment.bind(controller));
app.post('/api/v1/payment/create', controller.createPayment.bind(controller));
app.post('/api/v1/payment/pay/:id', controller.payPayment.bind(controller));
app.post('/api/v1/payment/reverse/:id', controller.reversePayment.bind(controller));
app.post('/api/v1/payment/cancel/:id', controller.cancelPayment.bind(controller));
