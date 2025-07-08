import { Request, Response } from "express";
import { findAdminById } from "../../repositories/admin.repository";
import { formatAdminResponse } from "../../resources/admin/admin.resource";
import { AdminMessages } from "../../constants/messages";
import { captureError } from "../../telemetry/sentry";
import { success, error } from "../../utils/responseWrapper";

export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    const adminId = req.user?.id!;
    const admin = await findAdminById(adminId);

    if (!admin) {
      return res.status(404).json(error(AdminMessages.notFound));
    }

    return res.json(success("Admin fetched", formatAdminResponse(admin)));
  } catch (err) {
    captureError(err, "getAdminProfile");
    return res.status(500).json(error("Failed to load admin profile"));
  }
};
