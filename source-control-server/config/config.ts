import * as dotenv from 'dotenv';
import { TransportOptions } from 'nodemailer';
dotenv.config();

const envVars = {
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_ACCESS_EXPIRATION_MINUTES: process.env.JWT_ACCESS_EXPIRATION_MINUTES as string,
    JWT_REFRESH_EXPIRATION_DAYS: process.env.JWT_REFRESH_EXPIRATION_DAYS as string,
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES as string,
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES as string,
    DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING as string,
    MAIL_HOST: process.env.MAIL_HOST as string,
    MAIL_USER: process.env.MAIL_USER as string,
    MAIL_PASS: process.env.MAIL_PASS as string,
    MAIL_CLIENT_ID: process.env.MAIL_CLIENT_ID as string,
    MAIL_CLIENT_SECRET: process.env.MAIL_CLIENT_SECRET as string,
    MAIL_REFRESH_TOKEN: process.env.MAIL_REFRESH_TOKEN as string,
    MAIL_REDIRECT_URL: process.env.MAIL_REDIRECT_URL as string,
}

const mongoose = {
    uri: envVars.DB_CONNECTION_STRING,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
}

const email = {
    service: envVars.MAIL_HOST,
    auth: {
        type: 'OAuth2',
        user: envVars.MAIL_USER,
        pass: envVars.MAIL_PASS,
        clientId: envVars.MAIL_CLIENT_ID,
        clientSecret: envVars.MAIL_CLIENT_SECRET,
        refreshToken: envVars.MAIL_REFRESH_TOKEN
    }
}

export default {
    mongoose,
    email,
    envVars
}