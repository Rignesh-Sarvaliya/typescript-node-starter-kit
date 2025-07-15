import { Request, Response, NextFunction } from "express";
import { findAdminById } from "../../repositories/admin.repository";
import { formatAdminResponse } from "../../resources/admin/admin.resource";
import { AdminMessages } from "../../constants/messages";
import { asyncHandler } from "../../utils/asyncHandler";
import { success, error } from "../../utils/responseWrapper";

export const getAdminProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const adminId = req.user?.id!;
    const admin = await findAdminById(adminId);

    if (!admin) {
      return res.status(404).json(error(AdminMessages.notFound));
    }

    return res.json(success("Admin fetched", formatAdminResponse(admin)));
  }
);
