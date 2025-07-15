import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  findUserByEmail,
  createUser,
} from "../../repositories/user.repository";
import { hashPassword, comparePassword } from "../../utils/hash";
import { generateSession } from "../../utils/session";
import { formatUserResponse } from "../../resources/user/user.resource";
import { findUserBySocialId } from "../../repositories/user.repository";
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
import { findUserByEmail } from "../../repositories/user.repository";
import { appEmitter, APP_EVENTS } from "../../events/emitters/appEmitter";



const prisma = new PrismaClient();

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  
  // Use domain value objects
  const emailVO = new Email(email);
  const passwordVO = new Password(password);

  const existing = await findUserByEmail(emailVO.getValue());
  if (existing) return res.status(409).json({ message: AuthMessages.emailExists });

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

  return res.json({
    message: AuthMessages.registered,
    user: formatUserResponse(user),
  });
};

const loginUser = async (req: Request, res: Response) => {
  const emailVO = new Email(req.body.email);
  const passwordVO = new Password(req.body.password);

  const userRecord = await findUserByEmail(emailVO.getValue());
  if (!userRecord) {
    return res.status(404).json({ message: AuthMessages.userNotFound });
  }

  const isMatch = await comparePassword(passwordVO.getValue(), userRecord.password);
  if (!isMatch) {
    return res.unauthorized(AuthMessages.invalidCredentials);
  }

  await generateSession(req, userRecord.id, "user");

  const userEntity = new UserEntity(userRecord.id, userRecord.name, userRecord.email);

  logLogin(emailVO.getValue());
  userEmitter.emit("user.loggedIn", { id: userRecord.id, email: userRecord.email });

  return res.json({
    message: AuthMessages.login,
    user: formatUserResponse(userEntity),
  });
};

const socialLogin = async (req: Request, res: Response) => {
  const { social_id, provider, name, email } = req.body;

  const prisma = new PrismaClient();

  let user = await prisma.user.findFirst({
    where: {
      social_id,
      provider,
    },
  });

  if (!user) {
    // Create new user
    user = await prisma.user.create({
      data: {
        name,
        email: email || `${provider}_${social_id}@nomail.com`,
        social_id,
        provider,
        password: "", // optional: fill with dummy since password won't be used
      },
    });
  }

  await generateSession(req, user.id, "user");

  return res.json({
    message: "Login successful",
    user: formatUserResponse(user),
  });
};


const appleDetails = async (req: Request, res: Response) => {
  const { id } = req.params;

  logAppleCheck(id);
  userEmitter.emit("appleDetailsChecked", { id });

  const user = await findUserBySocialId(id, "apple");

  if (!user) {
    return res.status(404).json({ message: "User not found for Apple ID" });
  }

  return res.json({
    message: "User found",
    user: formatUserResponse(user),
  });
};

const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  const otp = generateOtp();
  await saveOtpToRedis(email, otp);

  logOtpSend(email, otp);
  userEmitter.emit("otp.sent", { email, otp });

  // In real project, integrate email/SMS here
  return res.json({
    message: "OTP sent to email",
  });
};

const forgotPassword = async (req: Request, res: Response) => {
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
};


export const authenticationController = {
  registerUser,
  loginUser,
  socialLogin,
  appleDetails,
  sendOtp,
  forgotPassword,
};