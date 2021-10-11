export interface IGetLoyaltyReqParams {
    user_id: number
}

export interface ICreateLoyaltyReqBody {
    user_id: number
}

export interface IUpdateLoyaltyReqBody {
    bookingsCount: number
}

export interface IGetLoyaltyReqBody {
    user_id: number
}