import express, {Request, Response} from 'express';
import cookieParser from 'cookie-parser';
import {LoyaltyController} from './loyaltyController';

const controller = new LoyaltyController();

export const app = express();

app.use(cookieParser())
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
	res.status(200).json({message: 'health check'});
});

app.post('/api/v1/loyalty', controller.createLoyalty.bind(controller));
app.patch('/api/v1/loyalty', controller.updateLoyalty.bind(controller));
app.get('/api/v1/loyalty', controller.getLoyalty.bind(controller));
app.post('/api/v1/token', controller.responseWithToken.bind(controller));