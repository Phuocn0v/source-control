import { Request, Response, Router } from "express";
import authController from "../../controllers/auth.controller";
import catchAsync from "../../utils/catchAsync";

const router: Router = Router();

router.post('/register', catchAsync(authController.register));
router.post('/login', catchAsync(authController.login));
router.post('/logout', catchAsync(authController.logout));
router.post('/refresh', catchAsync(authController.refreshAuth));
router.post('/reset-password', catchAsync(authController.resetPassword));
router.post('/send-reset-password-email', catchAsync(authController.sendResetPasswordEmail));
router.post('/send-verification-email', catchAsync(authController.sendVerificationEmail));
router.post('/verify-email', catchAsync(authController.verifyEmailToken));

export default router;
