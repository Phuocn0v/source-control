import { Request, Response } from "express";
import { IUser } from "../models/user.model";

export interface ICreateUser {
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
    role: string;
}

export interface ILoginUser {
    username: string;
    password: string;
}

export interface RequestWithUser extends Request {
    user: IUser;
}