export const prodHost = {
    session: 'http://session-service.booking-ui.ru',
    gateway: 'http://gateway.booking-ui.ru'
}

export const devHost = {
    session: 'http://127.0.0.1:3001',
    gateway: 'http://127.0.0.1:3006'
}


export interface ILogin {
    email: string;
    password: string;
}

export interface ISignUp {
    username: string;
    email: string;
    password: string;
    role: string;
}

export interface IServiceResponse<T> {
    code: string
    body: T
}