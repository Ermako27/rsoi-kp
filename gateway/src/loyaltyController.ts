import {Request, Response} from 'express';
import axios from 'axios';
import {devServicePaths, prodServicePaths} from './interfaces/IGateway';
import {IResponse, IServiceResponse} from './interfaces/IResponse';
import {ILoyaltyModel} from './interfaces/ILoyalty';

export class LoyaltyController {
    private servicePaths: typeof prodServicePaths | typeof devServicePaths
    constructor() {
        this.servicePaths = process.env.MODE === "PRODUCTION" ? prodServicePaths : devServicePaths
    }
    async getLoyalty(req: Request, res: Response<IResponse>) {
        // 1) проверяем авторизацию
        if (!req.headers.cookie) {
            res.status(200).json({
                code: "401",
                body: {
                    message: 'Not authorized, no session cookie'
                }
            });
            return;
        }
        const authData = await axios.get<IServiceResponse<{message: string;}>>(
            `${this.servicePaths.session}/api/v1/verify`,
            {
                headers: {
                    Cookie: req.headers.cookie
                }
            }
        );

        if (authData.data.code !== "200") {
            res.status(200).json({
                code: authData.data.code,
                body: {
                    message: authData.data.body.message
                }
            });
            return;
        }

        const loyalty = await axios.get<IServiceResponse<{loyalty: ILoyaltyModel, message?: string}>>(
            `${this.servicePaths.loyalty}/api/v1/loyalty`,
            {
                headers: {
                    Cookie: req.headers.cookie
                }
            }
        );

        if (loyalty.data.code !== "200") {
            res.status(200).json({
                code: loyalty.data.code,
                body: {
                    message: loyalty.data.body.message
                }
            });
            return;
        } else {
            res.status(200).json({
                code: "200",
                body: {
                    loyalty: loyalty.data.body.loyalty
                }
            });
        }
    }
}