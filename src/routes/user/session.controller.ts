import { Request, Response } from "express";
import { destroySession } from "../../utils/session";
import { clearAllUserSessionKeys } from "../../utils/passwordAttempt";
import { logLogout } from "../../jobs/session.jobs";
import { captureError } from "../../telemetry/sentry";
import { Messages } from "../../constants/messages";

export const logout = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    await clearAllUserSessionKeys(userId!);
    await destroySession(req);
    logLogout(userId!);

    return res.json({ message: Messages.logoutSuccess });
  } catch (error) {
    captureError(error, "logout");
    return res.fail("Logout failed");
  }
};
