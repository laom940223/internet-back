import { AppError } from "../errors/AppError";


export interface ServerResponse<T> {

    data?: T,
    error?: AppError
    
}