import { Request, Response, NextFunction } from "express";
import {
  ChangePasswordRequestSchema,
  ResetPasswordBodySchema,
  ResetPasswordParamsSchema,
} from "../../requests/user/password.request";
import { comparePassword, hashPassword } from "../../utils/hash";
import {
  changeUserPassword,
  findUserWithPasswordById,
} from "../../repositories/user.repository";
import { Password } from "../../domain/valueObjects/password.vo";
import {
  isBlocked,
  recordFailedAttempt,
  clearFailedAttempts,
} from "../../utils/passwordAttempt";
import { logPasswordChange } from "../../jobs/password.jobs";
import { captureError } from "../../telemetry/sentry";
import { userEmitter } from "../../events/emitters/userEmitter";
import { success, error } from "../../utils/responseWrapper";
import { getUserIdFromToken, deleteResetToken } from "../../utils/resetToken";

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { current_password, new_password } =
      ChangePasswordRequestSchema.parse(req.body);

    if (await isBlocked(userId)) {
      return res
        .status(429)
        .json(error("Too many failed attempts. Try again later."));
    }

    const user = await findUserWithPasswordById(userId);
    if (!user) return res.status(404).json(error("User not found"));

    const current = new Password(current_password);
    const next = new Password(new_password);

    const match = await comparePassword(current.getValue(), user.password);
    if (!match) {
      await recordFailedAttempt(userId);
      return res.status(401).json(error("Current password is incorrect"));
    }

    const hashed = await hashPassword(next.getValue());

    await changeUserPassword(userId, hashed);
    await clearFailedAttempts(userId);

    logPasswordChange(userId);
    userEmitter.emit("user.passwordChanged", { userId });

    return res.json(success("Password changed successfully"));
  } catch (err) {
    captureError(err, "changePassword");
    return next(err);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = ResetPasswordParamsSchema.parse(req.params);
    const { new_password } = ResetPasswordBodySchema.parse(req.body);

    const userId = await getUserIdFromToken(token);
    if (!userId) return res.status(400).json(error("Invalid or expired token"));

    const next = new Password(new_password);
    const hashed = await hashPassword(next.getValue());

    await changeUserPassword(Number(userId), hashed);
    await deleteResetToken(token);

    userEmitter.emit("user.passwordReset", { userId: Number(userId) });

    return res.json(success("Password reset successfully"));
  } catch (err) {
    captureError(err, "resetPassword");
    return next(err);
  }
};
