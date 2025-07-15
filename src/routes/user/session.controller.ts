import { Request, Response, NextFunction } from "express";
import { destroySession } from "../../utils/session";
import { clearAllUserSessionKeys } from "../../utils/passwordAttempt";
import { invalidateAuthToken } from "../../utils/authToken";
import { logLogout } from "../../jobs/session.jobs";
import { captureError } from "../../telemetry/sentry";
import { Messages } from "../../constants/messages";
import { success, error } from "../../utils/responseWrapper";

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    await clearAllUserSessionKeys(userId!);
    await destroySession(req);
    invalidateAuthToken(userId!);
    logLogout(userId!);

    return res.json(success(Messages.logoutSuccess));
  } catch (err) {
    captureError(err, "logout");
    return next(err);
  }
};
