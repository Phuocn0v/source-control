import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import userService from "../services/user.service";
import authService from "../services/auth.service";
import tokenService from "../services/token.service";
import { Request, Response } from "express";
import Token from '../models/token.model';
import ApiError from "../utils/ApiError";
import { IUser } from "../models/user.model";
import { RequestWithUser } from '../dtos/user.dto';
import mailService from "../services/mail.service";
import ETokenTypes from "../config/token";

async function register(req: Request, res: Response) {
    const { email, username, password, phoneNumber, role } = req.body;
    const user = await userService.createUser({ email, username, password, phoneNumber, role });
    return res.status(httpStatus.CREATED).send(user);
}

async function login(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await authService.loginWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthTokens(user.getUser());

    return res.status(httpStatus.OK).send({ user: user.getUser(), tokens });
}

async function logout(req: Request, res: Response) {
    await authService.logout(req.body.refreshToken);
    return res.status(httpStatus.NO_CONTENT).send();
}

async function refreshAuth(req: Request, res: Response) {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    return res.status(httpStatus.OK).send({ tokens });
}

async function resetPassword(req: Request, res: Response) {
    const token = req.query?.Token?.toString();
    const newPassword = req.body.password;
    if (!token) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Token is required');
    }
    await authService.resetPassword(token, newPassword);
    return res.status(httpStatus.NO_CONTENT).send();
}

async function sendResetPasswordEmail(req: Request, res: Response) {
    await authService.sendResetPasswordEmail(req.body.email);
    return res.status(httpStatus.NO_CONTENT).send();
}

async function sendVerificationEmail(req: Request, res: Response) {
    const user: IUser = req.body.user;
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
    await mailService.sendVerificationEmail(user.email, verifyEmailToken);
    return res.status(httpStatus.NO_CONTENT).send();
}

async function verifyEmailToken(req: Request, res: Response) {
    const token = req.query?.Token?.toString();
    if (!token) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Token is required');
    }
    await authService.verifyEmail(token);
    return res.status(httpStatus.NO_CONTENT).send();
}

export default {
    register,
    login,
    logout,
    refreshAuth,
    resetPassword,
    sendResetPasswordEmail,
    sendVerificationEmail,
    verifyEmailToken
}
