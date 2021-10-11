import {Request, Response} from 'express';
import {LoyaltyModel} from './loyaltyModel';
import {LoyaltyStatuses} from './interfaces/ILoyalty'
import {IGetLoyaltyReqParams, ICreateLoyaltyReqBody, IUpdateLoyaltyReqBody, IGetLoyaltyReqBody} from './interfaces/IRequest';
import {IResponse} from './interfaces/IResponse';
import jwt from 'jsonwebtoken';

export class LoyaltyController {
    private loyaltyModel: LoyaltyModel;
    private jwtSecret: string;
    private serviceSecrets: {[key: string]: string};
    private serviceId: string;
    private serviceToken: string;
    private serviceSecret: string;
    constructor() {
        this.loyaltyModel = new LoyaltyModel();
        this.jwtSecret = 'jwtSecret'

        this.serviceSecrets = {
            'session-service-id': 'session-service-secret',
            'hotel-service-id': 'hotel-service-secret',
            'booking-service-id': 'booking-service-secret',
            'loyalty-service-id': 'loyalty-service-secret',
            'payment-service-id': 'payment-service-secret',
        }

        this.serviceId = 'loyalty-service-id';
        this.serviceSecret = 'loyalty-service-secret';
        this.serviceToken = '';
    }

    async responseWithToken(req: Request, res: Response<IResponse>) {
        if (req.headers.authorization) {
            const tokenData = req.headers.authorization.split(' ')[1]
            const [serviceId, serviceSecret] = tokenData.split(':');

            const token = jwt.sign({serviceId}, serviceSecret, {algorithm: "HS256", expiresIn: "10d"});
            res.status(200).json({
                code: "200",
                body: {
                    token
                }
            });
        }
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

    async createLoyalty(req: Request<any, any, ICreateLoyaltyReqBody>, res: Response<IResponse>) {
        try {
            const {user_id} = req.body;

            const token = req.headers['x-service-token'] as string;
            const serviceId = req.headers['x-service-id'] as string;
            const isValidToken = this.checkServiceToken(token, serviceId)

            if (!isValidToken) {
                res.status(200).json({
                    code: "403",
                    body: {
                        message: "Service call forbidden"
                    }
                });
            } else {
                const loyalty = await this.loyaltyModel.createLoyalty(user_id);
                res.status(200).json({
                    code: "200",
                    body: {
                        loyalty
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

    async updateLoyalty(req: Request<any, any, IUpdateLoyaltyReqBody>, res: Response<IResponse>) {
        try {
            const token = req.cookies['session_id'];
            const payload = jwt.verify(token, this.jwtSecret) as any;
            const {id: user_id} = payload;

            const {bookingsCount} = req.body;
            let status;
            let discount;
            let loyalty;
            switch (bookingsCount) {
                case 3:
                    status = LoyaltyStatuses.BRONZE;
                    discount = 10
                    loyalty = await this.loyaltyModel.updateLoyalty({user_id: user_id, status, discount});
                    res.status(200).json({
                        code: "200",
                        body: {
                            loyalty
                        }
                    });
                    return;
                case 5:
                    status = LoyaltyStatuses.SILVER;
                    discount = 20
                    loyalty = await this.loyaltyModel.updateLoyalty({user_id: user_id, status, discount});
                    res.status(200).json({
                        code: "200",
                        body: {
                            loyalty
                        }
                    });
                    return;
                case 7:
                    status = LoyaltyStatuses.GOLD;
                    discount = 30
                    loyalty = await this.loyaltyModel.updateLoyalty({user_id: user_id, status, discount});
                    res.status(200).json({
                        code: "200",
                        body: {
                            loyalty
                        }
                    });                    
                    return;
            }

            res.status(200).json({
                code: "200",
                body: {
                    loyalty: null
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

    async getLoyalty(req: Request, res: Response<IResponse>) {
        try {
            const token = req.cookies['session_id'];
            const payload = jwt.verify(token, this.jwtSecret) as any;
            const {id: user_id} = payload;
            const loyaltyData = await this.loyaltyModel.getLoyalty(user_id);
            const {loyalty} = loyaltyData;
            if (loyalty) {
                res.status(200).json({
                    code: "200",
                    body: {
                        loyalty
                    }
                });
            } else {
                res.status(200).json({
                    code: "404",
                    body: {
                        message: 'Loyalty not found'
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
}