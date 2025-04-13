import { Request, Response } from "express";
import { ChangePasswordRequestSchema } from "../../requests/user/password.request";
import { comparePassword, hashPassword } from "../../utils/hash";
import { changeUserPassword, findUserById } from "../../repositories/user.repository";
import { Password } from "../../domain/valueObjects/password.vo";
import { isBlocked, recordFailedAttempt, clearFailedAttempts } from "../../utils/passwordAttempt";
import { logPasswordChange } from "../../jobs/password.jobs";
import { captureError } from "../../telemetry/sentry";
import { userEmitter } from "../../events/emitters/userEmitter";

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { current_password, new_password } = ChangePasswordRequestSchema.parse(req.body);

    if (await isBlocked(userId)) {
      return res.status(429).json({ message: "Too many failed attempts. Try again later." });
    }

    const user = await findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const current = new Password(current_password);
    const next = new Password(new_password);

    const match = await comparePassword(current.getValue(), user.password);
    if (!match) {
      await recordFailedAttempt(userId);
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashed = await hashPassword(next.getValue());

    await changeUserPassword(userId, hashed);
    await clearFailedAttempts(userId);

    logPasswordChange(userId);
    userEmitter.emit("user.passwordChanged", { userId });

    return res.json({ message: "Password changed successfully" });
  } catch (error) {
    captureError(error, "changePassword");
    return res.status(500).json({ message: "Failed to change password" });
  }
};
