import { Request } from "express";

export interface IRequestAuth extends Request{
    user:{
        userId: number
        username: string
    }
}