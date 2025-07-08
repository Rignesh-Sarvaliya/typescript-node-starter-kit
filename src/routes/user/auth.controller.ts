import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  findUserByEmail,
  createUser,
} from "../../repositories/user.repository";
import { hashPassword, comparePassword } from "../../utils/hash";
import { generateSession } from "../../utils/session";
import { formatUserResponse } from "../../resources/user/user.resource";
import { AuthMessages, DefaultUserRole } from "../../constants/auth";

import { logAppleCheck } from "../../jobs/logAppleCheck";
import { userEmitter } from "../../events/emitters/userEmitter";
import { logRegistration, logLogin } from "../../jobs/auth.jobs";
import { generateOtp, saveOtpToRedis } from "../../utils/otp";
import { logOtpSend } from "../../jobs/otp.jobs";
import { generateResetToken } from "../../utils/resetToken";
import { ResetPasswordConstants } from "../../constants/reset";
import { logResetLink } from "../../jobs/reset.jobs";
import { Email } from "../../domain/valueObjects/email.vo";
import { Password } from "../../domain/valueObjects/password.vo";
import { UserEntity } from "../../domain/entities/user.entity";
import { appEmitter, APP_EVENTS } from "../../events/emitters/appEmitter";
import { captureError } from "../../telemetry/sentry";
import { issueAuthToken } from "../../utils/authToken";

const prisma = new PrismaClient();

const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Use domain value objects
    const emailVO = new Email(email);
    const passwordVO = new Password(password);

    const existing = await findUserByEmail(emailVO.getValue());
    if (existing)
      return res.status(409).json({ message: AuthMessages.emailExists });

    const hashed = await hashPassword(passwordVO.getValue());

    const user = await createUser({
      name,
      email: emailVO.getValue(),
      password: hashed,
    });

    appEmitter.emit(APP_EVENTS.USER_REGISTERED, {
      id: user.id,
      email: user.email,
    });

    await generateSession(req, user.id, "user");

    logRegistration(email);
    userEmitter.emit("user.registered", { id: user.id, email });

    const userEntity = new UserEntity(user.id, user.name, user.email);
    return res.json({
      message: AuthMessages.registered,
      user: formatUserResponse(userEntity),
    });
  } catch (error) {
    captureError(error, "registerUser");
    return res.status(500).json({ message: "Registration failed" });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const emailVO = new Email(req.body.email);
    const passwordVO = new Password(req.body.password);

    const userRecord = await findUserByEmail(emailVO.getValue());
    if (!userRecord) {
      return res.status(404).json({ message: AuthMessages.userNotFound });
    }

    const isMatch = await comparePassword(
      passwordVO.getValue(),
      userRecord.password
    );
    if (!isMatch) {
      return res.status(401).json({ message: AuthMessages.invalidCredentials });
    }

    await generateSession(req, userRecord.id, "user");

    const userEntity = new UserEntity(
      userRecord.id,
      userRecord.name,
      userRecord.email
    );
    const token = issueAuthToken(userRecord.id, "user");

    logLogin(emailVO.getValue());
    userEmitter.emit("user.loggedIn", {
      id: userRecord.id,
      email: userRecord.email,
    });

    return res.json({
      message: AuthMessages.login,
      user: formatUserResponse(userEntity),
      token,
    });
  } catch (error) {
    captureError(error, "loginUser");
    return res.status(500).json({ message: "Login failed" });
  }
};

const socialLogin = async (req: Request, res: Response) => {
  try {
    // Social login is not supported by the current schema
    return res.status(400).json({ message: "Social login is not supported." });
  } catch (error) {
    captureError(error, "socialLogin");
    return res.status(500).json({ message: "Social login failed" });
  }
};

const appleDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    logAppleCheck(id);
    userEmitter.emit("appleDetailsChecked", { id });

    // Apple details lookup is not supported by the current schema
    return res
      .status(400)
      .json({ message: "Apple details lookup is not supported." });
  } catch (error) {
    captureError(error, "appleDetails");
    return res.status(500).json({ message: "Failed to fetch apple details" });
  }
};

const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const otp = generateOtp();
    await saveOtpToRedis(email, otp);

    logOtpSend(email, otp);
    userEmitter.emit("otp.sent", { email, otp });

    // In real project, integrate email/SMS here
    return res.json({
      message: "OTP sent to email",
    });
  } catch (error) {
    captureError(error, "sendOtp");
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const emailVO = new Email(req.body.email);

    const user = await findUserByEmail(emailVO.getValue());
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const token = await generateResetToken(user.id);
    const resetUrl = `${ResetPasswordConstants.linkPrefix}${token}`;

    logResetLink(emailVO.getValue(), resetUrl);
    userEmitter.emit("password.reset_link.sent", { email: user.email, token });

    return res.json({ message: "Password reset link sent", resetUrl });
  } catch (error) {
    captureError(error, "forgotPassword");
    return res.status(500).json({ message: "Failed to send reset link" });
  }
};

export const authenticationController = {
  registerUser,
  loginUser,
  socialLogin,
  appleDetails,
  sendOtp,
  forgotPassword,
};
