export interface ICreateUserReqBody {
    email: string;
    password: string;
    username: string;
    role: string;
}

export interface IGetUserReqParams {
    id: number
}