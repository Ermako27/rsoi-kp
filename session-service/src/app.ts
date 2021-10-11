import express, {Request, Response} from 'express';
import cookieParser from 'cookie-parser';
import { UserController } from './usersController';
const controller = new UserController();

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

app.post('/api/v1/users', controller.createUser.bind(controller));
app.get('/api/v1/users', controller.getUsers.bind(controller));
app.get('/api/v1/users/:id', controller.getUser.bind(controller));
app.post('/api/v1/login', controller.login.bind(controller));
app.post('/api/v1/logout', controller.logout.bind(controller));
app.get('/api/v1/verify', controller.verify.bind(controller));
app.get('/api/v1/refresh', controller.refresh.bind(controller));
