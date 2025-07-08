import { Request, Response } from "express";
import { AdminLoginRequestSchema } from "../../requests/admin/auth.request";
import { findAdminByEmail } from "../../repositories/admin.repository";
import { hashPassword, comparePassword } from "../../utils/hash";
import { generateSession } from "../../utils/session";
import { AdminMessages } from "../../constants/messages";
import { AdminEntity } from "../../domain/entities/admin.entity";
import { formatAdminResponse } from "../../resources/admin/admin.resource";
import { logAdminLogin } from "../../jobs/admin.jobs";
import { AdminPassword } from "../../domain/valueObjects/adminPassword.vo";
import { captureError } from "../../telemetry/sentry";
import { appEmitter, APP_EVENTS } from "../../events/emitters/appEmitter";
import { issueAuthToken } from "../../utils/authToken";
import { signJwt } from "../../utils/jwt";
import { success, error } from "../../utils/responseWrapper";

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = AdminLoginRequestSchema.parse(req.body);

    const admin = await findAdminByEmail(email);
    if (!admin)
      return res.status(404).json(error(AdminMessages.notFound));

    const valid = await comparePassword(password, admin.password);
    if (!valid)
      return res
        .status(401)
        .json(error(AdminMessages.invalidCredentials));

    const adminEntity = new AdminEntity(admin.id, admin.name, admin.email);

    await generateSession(req, admin.id, "admin");
    const token = issueAuthToken(admin.id, "admin");
//     const token = signJwt({ id: admin.id, role: "admin" });
    logAdminLogin(admin.id, admin.email);

    appEmitter.emit(APP_EVENTS.ADMIN_LOGGED_IN, {
      id: admin.id,
      email: admin.email,
      timestamp: new Date(),
    });

    return res.json(
      success(AdminMessages.loginSuccess, {
        admin: formatAdminResponse(adminEntity),
        token,
      })
    );
  } catch (err) {
    captureError(err, "adminLogin");
    return res.status(500).json(error("Login failed"));
  }
};
