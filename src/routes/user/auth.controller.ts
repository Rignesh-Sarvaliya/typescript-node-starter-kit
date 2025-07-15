import { Request, Response, NextFunction } from "express";
import { findUserByEmail } from "../../repositories/user.repository";
import { createUser } from "../../services/user.service";
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

import { asyncHandler } from "../../utils/asyncHandler";
import { issueAuthToken } from "../../utils/authToken";
import { signJwt } from "../../utils/jwt";
import { success, error } from "../../utils/responseWrapper";


const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    // Use domain value objects
    const emailVO = new Email(email);
    const passwordVO = new Password(password);

    const existing = await findUserByEmail(emailVO.getValue());
    if (existing)
      return res.status(409).json(error(AuthMessages.emailExists));

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
    return res.json(
      success(AuthMessages.registered, formatUserResponse(userEntity))
    );
  }
);

const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const emailVO = new Email(req.body.email);
    const passwordVO = new Password(req.body.password);

    const userRecord = await findUserByEmail(emailVO.getValue());
    if (!userRecord) {
      return res.status(404).json(error(AuthMessages.userNotFound));
    }

    const isMatch = await comparePassword(
      passwordVO.getValue(),
      userRecord.password
    );
    if (!isMatch) {
      return res.status(401).json(error(AuthMessages.invalidCredentials));
    }

    await generateSession(req, userRecord.id, "user");

    const userEntity = new UserEntity(
      userRecord.id,
      userRecord.name,
      userRecord.email
    );
    const token = issueAuthToken(userRecord.id, "user");
//     const token = signJwt({ id: userRecord.id, role: "user" });

    logLogin(emailVO.getValue());
    userEmitter.emit("user.loggedIn", {
      id: userRecord.id,
      email: userRecord.email,
    });

    return res.json(
      success(AuthMessages.login, { user: formatUserResponse(userEntity), token })
    );
  }
);

const socialLogin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Social login is not supported by the current schema
    return res.status(400).json(error("Social login is not supported."));
  }
);

const appleDetails = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    logAppleCheck(id);
    userEmitter.emit("appleDetailsChecked", { id });

    // Apple details lookup is not supported by the current schema
    return res
      .status(400)
      .json(error("Apple details lookup is not supported."));
  }
);

const sendOtp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const otp = generateOtp();
    await saveOtpToRedis(email, otp);

    logOtpSend(email, otp);
    userEmitter.emit("otp.sent", { email, otp });

    // In real project, integrate email/SMS here
    return res.json(success("OTP sent to email"));
  }
);

const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const emailVO = new Email(req.body.email);

    const user = await findUserByEmail(emailVO.getValue());
    if (!user) {
      return res.status(404).json(error("Email not found"));
    }

    const token = await generateResetToken(user.id);
    const resetUrl = `${ResetPasswordConstants.linkPrefix}${token}`;

    logResetLink(emailVO.getValue(), resetUrl);
    userEmitter.emit("password.reset_link.sent", { email: user.email, token });

    return res.json(success("Password reset link sent", { resetUrl }));
  }
);

export const authenticationController = {
  registerUser,
  loginUser,
  socialLogin,
  appleDetails,
  sendOtp,
  forgotPassword,
};
