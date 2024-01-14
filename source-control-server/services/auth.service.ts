import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import { IUser, IUserModel } from "../models/user.model";
import Token, { IToken, ITokenModel } from "../models/token.model";
import userService from "./user.service";
import ETokenTypes from "../config/token";
import tokenService from "./token.service";
import mailService from "./mail.service";

async function loginWithEmailAndPassword(email: string, password: string) {
    const user: IUserModel = await userService.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
}

async function logout(refreshToken: string) {
    const refreshTokenDoc: ITokenModel | null = await Token.findOne({ token: refreshToken, type: ETokenTypes.REFRESH, blacklisted: false });
    if (!refreshTokenDoc) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await refreshTokenDoc.deleteOne();
}

async function refreshAuth(refreshToken: string) {
    const token: IToken = await tokenService.verifyToken(refreshToken, ETokenTypes.REFRESH);
    const user: IUser = await userService.getUserById(token.user.toString());
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
    }
    await logout(refreshToken);
}

async function resetPassword(resetPasswordToken: string, newPassword: string) {
    const token = await tokenService.verifyToken(resetPasswordToken, ETokenTypes.RESET_PASSWORD);
    const user: IUser = await userService.getUserById(token.user.toString());
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return await userService.updateUserById(user._id.toString(), { ...user, password: newPassword });
}

async function sendResetPasswordEmail(email: string) {
    const user: IUserModel = await userService.getUserByEmail(email);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    const resetPasswordToken = await tokenService.generateResetPasswordToken(user.getUser());
    await mailService.sendResetPasswordEmail(user.getUser()._id.toString(), resetPasswordToken);
}

async function verifyEmail(verifyEmailToken: string) {
    const token = await tokenService.verifyToken(verifyEmailToken, ETokenTypes.VERIFY_EMAIL);
    const user: IUser = await userService.getUserById(token.user.toString());
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    return await userService.updateUserById(user._id.toString(), { ...user, isEmailVerified: true });
}

export default {
    loginWithEmailAndPassword,
    logout,
    refreshAuth,
    resetPassword,
    sendResetPasswordEmail,
    verifyEmail
}
