export interface IUserModel {
    id: string,
    role: string,
    email: string,
    password: string,
    username: string
}

export enum UserRoles {
    ADMIN = 'ADMIN',
    COMMON = 'COMMON'
}