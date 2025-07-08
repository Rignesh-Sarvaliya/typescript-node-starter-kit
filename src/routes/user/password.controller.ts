import { Request, Response } from "express";
import { ChangePasswordRequestSchema } from "../../requests/user/password.request";
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

export const changePassword = async (req: Request, res: Response) => {
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
    return res.status(500).json(error("Failed to change password"));
  }
};
