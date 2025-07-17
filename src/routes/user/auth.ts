import { Router } from "express";
import validateRequest from "@/middlewares/validateRequest";
import { authenticationController } from "@/routes/user/auth.controller";
import {
  RegisterRequestSchema,
  LoginRequestSchema,
  SocialLoginRequestSchema,
} from "@/requests/user/auth.request";
import { AppleDetailsRequestSchema } from "@/requests/user/auth.request";
import { logAppleRoute } from "@/middlewares/logRouteMiddleware";
import { SendOtpRequestSchema } from "@/requests/user/auth.request";
import { ForgotPasswordSchema } from "@/requests/user/auth.request";

const router = Router();

router.post(
  "/auth/register",
  validateRequest({ body: RegisterRequestSchema }),
  authenticationController.registerUser
);
router.post(
  "/auth/login",
  validateRequest({ body: LoginRequestSchema }),
  authenticationController.loginUser
);
router.post(
  "/auth/social-login",
  validateRequest({ body: SocialLoginRequestSchema }),
  authenticationController.socialLogin
);
router.get(
  "/auth/apple-details/:id",
  logAppleRoute,
  validateRequest({ params: AppleDetailsRequestSchema }),
  authenticationController.appleDetails
);
router.post(
  "/auth/send/otp",
  validateRequest({ body: SendOtpRequestSchema }),
  authenticationController.sendOtp
);
router.post(
  "/auth/forgot/password",
  validateRequest({ body: ForgotPasswordSchema }),
  authenticationController.forgotPassword
);
export default router;
