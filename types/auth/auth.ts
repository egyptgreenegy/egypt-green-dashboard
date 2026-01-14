export interface IAuthState {
    user:any,
    access_token?:string|null
}
export interface LoginDto {
    email:string,
    password:string,
}