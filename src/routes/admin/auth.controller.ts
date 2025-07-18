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
import { appEmitter, APP_EVENTS } from "../emitters/appEmitter";

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = AdminLoginRequestSchema.parse(req.body);

    const admin = await findAdminByEmail(email);
    if (!admin) return res.status(404).json({ message: AdminMessages.notFound });

    const valid = await comparePassword(password, admin.password);
    if (!valid) return res.unauthorized(AdminMessages.invalidCredentials);

    const adminEntity = new AdminEntity(admin.id, admin.name, admin.email);

    await generateSession(req, admin.id, "admin");
    logAdminLogin(admin.id, admin.email);

    appEmitter.emit(APP_EVENTS.ADMIN_LOGGED_IN, {
      id: admin.id,
      email: admin.email,
      timestamp: new Date(),
    });

    
    return res.json({
      message: AdminMessages.loginSuccess,
      admin: formatAdminResponse(adminEntity),
    });
  } catch (error) {
    captureError(error, "adminLogin");
    return res.fail("Login failed");
  }
};
