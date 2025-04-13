import { Request, Response } from "express";
import { findAdminById } from "../../repositories/admin.repository";
import { formatAdminResponse } from "../../resources/admin/admin.resource";
import { AdminMessages } from "../../constants/messages";
import { captureError } from "../../telemetry/sentry";

export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.id!;
    const admin = await findAdminById(adminId);

    if (!admin) {
      return res.status(404).json({ message: AdminMessages.notFound });
    }

    return res.json({ admin: formatAdminResponse(admin) });
  } catch (error) {
    captureError(error, "getAdminProfile");
    return res.status(500).json({ message: "Failed to load admin profile" });
  }
};
