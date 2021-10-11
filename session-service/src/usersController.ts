import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {UserModel} from './usersModel';
import {ICreateUserReqBody} from './interfaces/IRequest';
import {IGetUserReqParams} from './interfaces/IRequest';
import {IResponse, IServiceResponse} from './interfaces/IResponse';
import {IUserModel, devServicePaths, prodServicePaths} from './interfaces/IUser';
import axios from 'axios';


export class UserController {
    private userModel: UserModel;
    private jwtSecret: string;
    private refreshSecret: string;
    private servicePaths: typeof prodServicePaths | typeof devServicePaths;
    private serviceSecrets: {[key: string]: string};
    private serviceSecret: string;
    private serviceId: string;
    private serviceToken: string;


    constructor() {
        this.userModel = new UserModel();
        this.jwtSecret = 'jwtSecret';
        this.refreshSecret = 'refreshSecret';
        this.servicePaths = process.env.MODE === "PRODUCTION" ? prodServicePaths : devServicePaths;

        this.serviceSecrets = {
            'session-service-id': 'session-service-secret',
            'hotel-service-id': 'hotel-service-secret',
            'booking-service-id': 'booking-service-secret',
            'loyalty-service-id': 'loyalty-service-secret',
            'payment-service-id': 'payment-service-secret',
        }

        this.serviceId = 'session-service-id';
        this.serviceSecret = 'session-service-secret';
        this.serviceToken = '';
    }

    async responseWithToken(req: Request, res: Response<IResponse>) {
        if (req.headers.authorization) {
            const tokenData = req.headers.authorization.split(' ')[1]
            const [serviceId, serviceSecret] = tokenData.split(':');
            const token = jwt.sign({serviceId}, serviceSecret, {algorithm: "HS256", expiresIn: "10h"});
            res.status(200).json({
                code: "200",
                body: {
                    token
                }
            });
        }
    }

    async requestToken(host: string) {
        const token = await axios.post<IServiceResponse<{token: string}>>(
            `${host}/api/v1/token`,
            {},
            {
                headers: {
                    'Authorization': `Basic ${this.serviceId}:${this.serviceSecret}`
                }
            }
        );

        this.serviceToken = token.data.body.token;
    }

    checkServiceToken(token: string, serviceId: string) {
        if (!token || token === '') {
            return false;
        }

        if (!serviceId || serviceId === '') {
            return false;
        }

        try{
            jwt.verify(token, this.serviceSecrets[serviceId]);
            return true;
        } catch(error: any) {
            return false;
        }
    }

    async createUser(req: Request<any, any, ICreateUserReqBody>, res: Response<IResponse>): Promise<any> {
        try {
            const {body} = req;
            const user = await this.userModel.createUser(body);

            // создаем лояльность пользователю
            const loyalty = await axios.post<IServiceResponse<{room: IUserModel, message?: any;}>>(
                `${this.servicePaths.loyalty}/api/v1/loyalty`,
                {
                    user_id: user.id
                },
                {
                    headers: {
                        'x-service-token': this.serviceToken,
                        'x-service-id': this.serviceId
                    }
                }
            );

            if (loyalty.data.code === '403') {
                await this.requestToken(this.servicePaths.loyalty);
                await axios.post<IServiceResponse<{room: IUserModel, message?: any;}>>(
                    `${this.servicePaths.loyalty}/api/v1/loyalty`,
                    {
                        user_id: user.id
                    },
                    {
                        headers: {
                            'x-service-token': this.serviceToken,
                            'x-service-id': this.serviceId
                        }
                    }
                );
            }

            // создаем запись в статистику про покупки пользователя
            const reportRecord = await axios.post<IServiceResponse<{room: IUserModel, message?: any;}>>(
                `${this.servicePaths.payment}/api/v1/payment/report`,
                {
                    user_id: user.id,
                    username: user.username
                },
                {
                    headers: {
                        'x-service-token': this.serviceToken,
                        'x-service-id': this.serviceId
                    }
                }
            );

            res.status(200).json({
                code: "200",
                body: {
                    user
                }
            });
        } catch(error: any) {
            const {body} = req;
            switch (error.code) {
                case "23505":
                    res.status(200).json({
                        code: "409",
                        body: {
                            message: `user with email ${body.email} already exist` 
                        }
                    });
                    break;
                default:
                    res.status(200).json({
                        code: "500",
                        body: {
                            message: error
                        }
                    });
            }
        }
    }

    async getUsers(req: Request, res: Response<IResponse>) {
        try {
            const {users} = await this.userModel.getUsers();
            res.status(200).json({
                code: "200",
                body: {
                    users
                }
            })
        } catch (error) {
            res.status(200).json({
                code: "500",
                body: {
                    message: error
                }
            });
        }
    }

    async getUser(req: Request<IGetUserReqParams>, res: Response<IResponse>) {
        try {
            const {id} = req.params;
            const userData = await this.userModel.getUser(id);

            if (userData.count !== 0) {
                res.status(200).json({
                    code: "200",
                    body: {
                        userId: userData.user
                    }
                });
            } else {
                res.status(200).json({
                    code: "404",
                    body: {
                        message: 'user not found'
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

    async login(req: Request, res: Response) {

        // проверяем есть ли вообще такой заголовок
        if (!req.headers.authorization) {
            res.status(200).json({
                code: "400",
                body: {
                    message: 'No Authorization header'
                }
            });
            return;
        }

        const authData = req.headers.authorization.split(' ')[1]
        
        // проверяем есть ли в нем данные для авторизации
        if (!authData) {
            res.status(200).json({
                code: "400",
                body: {
                    message: 'No auth data in Authorization header'
                }
            });
            return;
        }
        const [email, password] = authData.split(':');

        // проверяем есть ли такой пользователь в базе
        const userData = await this.userModel.getUserByEmail(email);
        if (userData.count === 0) {
            res.status(200).json({
                code: "401",
                body: {
                    message: 'Email or password is incorrect'
                }
            });
            return;
        }

        // проверяем верен ли пароль от пользователя
        const isPasswordCorrect = await this.userModel.isPasswordCorrect(email, password);

        if (!isPasswordCorrect) {
            res.status(200).json({
                code: "401",
                body: {
                    message: 'Email or password is incorrect'
                }
            });
            return;
        }

        // выдаем токен и рефреш токен
        const token = jwt.sign(userData.user, this.jwtSecret, {algorithm: "HS256", expiresIn: "10h"});
        const refreshToken = jwt.sign(userData.user, this.refreshSecret, {algorithm: "HS256", expiresIn: "10d"});

        const domain = process.env.MODE === 'PRODUCTION' ? '.booking-ui.ru' : undefined
        res.cookie('session_id', token, {httpOnly: true, expires: new Date(2022, 12, 1), domain});
        res.cookie('refresh_token', refreshToken, {httpOnly: true, expires: new Date(2022, 12, 1), domain});

        res.status(200).json({
            code: "200",
            body: {
                user: userData.user,
            }
        });
    }

    async verify(req: Request, res: Response<IResponse>) {
        const sessionId = req.cookies['session_id'];

        // проверяем есть ли вообще такая кука
        if (!sessionId) {
            res.status(200).json({
                code: "401",
                body: {
                    message: 'Not authorized, no session cookie'
                }
            });
            return;
        }

        try {
            // проверяем валиднось jwt токена
            jwt.verify(sessionId, this.jwtSecret);

            res.status(200).json({
                code: "200",
                body: {
                    message: 'User authorized',
                }
            });
        } catch (error: any) {
            switch (error.name) {
                case 'TokenExpiredError':
                    res.status(200).json({
                        code: "401",
                        body: {
                            message: "Token Expired",
                        }
                    });
            }
        }
    }

    async logout(req: Request, res: Response<IResponse>) {
        const sessionId = req.cookies['session_id'];
        const resreshToken = req.cookies['refresh_token'];

        // проверяем есть ли вообще токен
        if (!sessionId) {
            res.status(200).json({
                code: "401",
                body: {
                    message: 'Not authorized'
                }
            });
            return;
        }

        // удаляем куки
        const domain = process.env.MODE === 'PRODUCTION' ? '.booking-ui.ru' : undefined
        res.cookie('session_id', sessionId, {httpOnly: true, expires: new Date(2000, 12, 1), domain});
        res.cookie('refresh_token', resreshToken, {httpOnly: true, expires: new Date(2000, 12, 1), domain});

        res.status(200).json({
            code: "200",
            body: {
                message: 'success logout',
            }
        });
    }

    async refresh(req: Request, res: Response<IResponse>) {
        const resreshToken = req.cookies['refresh_token'];

        // проверяем есть ли вообще рефреш токен
        if (!resreshToken) {
            res.status(200).json({
                code: "401",
                body: {
                    message: 'No refresh token'
                }
            });
            return;
        }

        try {
            // проверяем время жизни рефреш токена
            const payload = jwt.verify(resreshToken, this.refreshSecret) as any;

            const userPayload = {
                id: payload.id,
                role: payload.role,
                email: payload.email,
                password: payload.password,
                username: payload.username
            }

            const token = jwt.sign(userPayload, this.jwtSecret, {algorithm: "HS256", expiresIn: "10h"});

            // если все ок, то ставим новую куку
            res.cookie('session_id', token, {httpOnly: true, expires: new Date(2022, 12, 1)});
            res.status(200).json({
                code: "200",
                body: {
                    message: 'Jwt refreshed',
                }
            });
        } catch (error: any) {
            // если рефреш истек, то все - разлогиниваем
            switch (error.name) {
                case 'TokenExpiredError':
                    res.status(200).json({
                        code: "401",
                        body: {
                            message: "Refresh token Expired",
                        }
                    });
            }
        }
    }
}
