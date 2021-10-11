import {IUserModel} from './IUser';

export interface IResponse {
    code: string
    body: {[key:string ]:any}
}

export interface IGetUsersResponse {
    users: IUserModel[];
    count: number
}

export interface IGetUserResponse {
    user: IUserModel;
    count: number
}

export interface ICreateUserResponse {
    id: number
}

export interface IServiceResponse<T> {
    code: string
    body: T
}