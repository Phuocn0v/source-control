import nodemailer from 'nodemailer'
import config from '../config/config'

const transporter: nodemailer.Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: config.envVars.MAIL_USER,
        clientId: config.envVars.MAIL_CLIENT_ID,
        clientSecret: config.envVars.MAIL_CLIENT_SECRET,
        refreshToken: config.envVars.MAIL_REFRESH_TOKEN,
    }
});

const sendEmail = async (to: string, subject: string, html: string) => {
    const mailOptions: nodemailer.SendMailOptions = {
        from: config.envVars.MAIL_USER,
        to,
        subject,
        html
    }

    await transporter.sendMail(mailOptions);
}

const sendVerificationEmail = async (to: string, token: string) => {
    const subject = 'Email Verification';
    const html = `<p>Please click <a href="${config.envVars.MAIL_REDIRECT_URL}/verify-email/${token}">here</a> to verify your email.</p>`;

    await sendEmail(to, subject, html);
}

const sendResetPasswordEmail = async (to: string, token: string) => {
    const subject = 'Reset Password';
    const html = `<p>Please click <a href="${config.envVars.MAIL_REDIRECT_URL}/reset-password/${token}">here</a> to reset your password.</p>`;

    await sendEmail(to, subject, html);
}

export default {
    sendVerificationEmail,
    sendResetPasswordEmail
}