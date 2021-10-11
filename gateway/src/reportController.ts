import {Request, Response} from 'express';
import {IResponse, IServiceResponse} from './interfaces/IResponse';
import axios from 'axios';
import {devServicePaths, prodServicePaths} from './interfaces/IGateway';
import {IUserPaymentReport} from './interfaces/IReport';

export class ReportController {
    private servicePaths: typeof prodServicePaths | typeof devServicePaths
    constructor() {
        this.servicePaths = process.env.MODE === "PRODUCTION" ? prodServicePaths : devServicePaths;
    }
    async getUsersReport(req: Request, res: Response<IResponse>) {
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

        // 2) идем за отчетом
        const report = await axios.get<IServiceResponse<{report: IUserPaymentReport, message?: string}>>(
            `${this.servicePaths.payment}/api/v1/payment/report`,
            {
                headers: {
                    Cookie: req.headers.cookie
                }
            }
        );
        
        if (report.data.code !== "200") {
            res.status(200).json({
                code: report.data.code,
                body: {
                    message: report.data.body.message
                }
            });
            return;
        } else {
            res.status(200).json({
                code: "200",
                body: {
                    report: report.data.body.report
                }
            });
        }
    }
}