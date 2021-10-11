export interface ICreatePaymentReqBody {
    price: number
}

export interface IChangePaymentStatusParams {
    id: number
}

export interface IDeletePaymetParams {
    id: number
}

export interface ICreateReportRecordReqParams {
    user_id: number;
    username: string
}