import jwt, { JwtPayload } from "jsonwebtoken";
import Token, { IToken, ITokenModel } from "../models/token.model";
import { IUser } from "../models/user.model";
import mongoose from "mongoose";
import ETokenTypes from "../config/token";
import moment, { Moment } from "moment";

interface ITokenPayload {
    sub: mongoose.Schema.Types.ObjectId | string,
    iat: number,
    exp: number,
    type: ETokenTypes
}

const generateToken = async (
    userId: mongoose.Schema.Types.ObjectId,
    expires: Moment,
    type: ETokenTypes,
    secret = process.env.JWT_SECRET as string
) => {
    const payload: ITokenPayload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type
    }

    return jwt.sign(payload, secret);
}

const saveToken = async (
    token: String,
    userId: mongoose.Schema.Types.ObjectId,
    expires: Moment,
    type: ETokenTypes,
    blackListed: boolean) => {
    const tokenDoc = await Token.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted: blackListed
    });

    return tokenDoc;
}

async function verifyToken(token: string, type: ETokenTypes) {
    const payload: string | JwtPayload = jwt.verify(token, process.env.JWT_SECRET as string);
    const tokenDoc: IToken | null = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
    if (!tokenDoc) {
        throw new Error('Token not found');
    }
    return tokenDoc;
};

const generateAuthTokens = async (user: IUser) => {
    const accessTokenExpires = moment().add(process.env.JWT_ACCESS_EXPIRATION_MINUTES as string, 'minutes');
    const accessToken = await generateToken(user._id, accessTokenExpires, ETokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(process.env.JWT_REFRESH_EXPIRATION_DAYS as string, 'days');
    const refreshToken = await generateToken(user._id, refreshTokenExpires, ETokenTypes.REFRESH);

    await saveToken(refreshToken, user._id, refreshTokenExpires, ETokenTypes.REFRESH, false);

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate()
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate()
        }
    };
};

const generateResetPasswordToken = async (user: IUser) => {
    const expires = moment().add(process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES as string, 'minutes');
    const resetPasswordToken = await generateToken(user._id, expires, ETokenTypes.RESET_PASSWORD);
    await saveToken(resetPasswordToken, user._id, expires, ETokenTypes.RESET_PASSWORD, false);
    return resetPasswordToken;
};

const generateVerifyEmailToken = async (user: IUser) => {
    const expires = moment().add(process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES as string, 'minutes');
    const verifyEmailToken = await generateToken(user._id, expires, ETokenTypes.VERIFY_EMAIL);
    await saveToken(verifyEmailToken, user._id, expires, ETokenTypes.VERIFY_EMAIL, false);
    return verifyEmailToken;
};

export default {
    verifyToken,
    generateAuthTokens,
    generateResetPasswordToken,
    generateVerifyEmailToken
}
