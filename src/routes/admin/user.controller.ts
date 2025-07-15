import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import {
  getAllUsers,
  updateUserById,
  toggleUserStatus,
  softDeleteUser,
} from "../../repositories/user.repository";
import {
  formatUserListForAdmin,
  formatUserForAdmin,
} from "../../resources/admin/user.resource";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  UpdateUserParamSchema,
  UpdateUserBodySchema,
  DeleteUserParamSchema,
  ToggleUserParamSchema,
} from "../../requests/admin/user.request";
import {
  logUserUpdated,
  logUserToggled,
  logUserDeleted,
} from "../../jobs/user.jobs";
import { success, error } from "../../utils/responseWrapper";

const prisma = new PrismaClient();

export const getAllUsersHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await getAllUsers();
    return res.json(success("Users fetched", formatUserListForAdmin(users)));
  }
);

export const updateUserHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = UpdateUserParamSchema.parse(req.params);
    const body = UpdateUserBodySchema.parse(req.body);

    const updated = await updateUserById(Number(id), body);

    logUserUpdated(Number(id));

    return res.json(
      success("User updated successfully", formatUserForAdmin(updated))
    );
  }
);

export const toggleUserStatusHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = ToggleUserParamSchema.parse(req.params);
    const user = await toggleUserStatus(Number(id));

    logUserToggled(user.id, user.status);

    return res.json(
      success(`User ${user.status ? "activated" : "deactivated"}`, formatUserForAdmin(user))
    );
  }
);

export const deleteUserHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = DeleteUserParamSchema.parse(req.params);
    const user = await softDeleteUser(Number(id));

    logUserDeleted(user.id);

    return res.json(
      success("User deleted successfully", formatUserForAdmin(user))
    );
  }
);
