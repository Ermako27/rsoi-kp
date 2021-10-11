export interface IResponse {
    code: string
    body: {[key:string ]:any}
}

export interface IServiceResponse<T> {
    code: string
    body: T
}