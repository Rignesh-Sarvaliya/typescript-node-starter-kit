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
import { captureError } from "../../telemetry/sentry";
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

export const getAllUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getAllUsers();
    return res.json(success("Users fetched", formatUserListForAdmin(users)));
  } catch (err) {
    captureError(err, "getAllUsers");
    return next(err);
  }
};

export const updateUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = UpdateUserParamSchema.parse(req.params);
    const body = UpdateUserBodySchema.parse(req.body);

    const updated = await updateUserById(Number(id), body);

    logUserUpdated(Number(id));

    return res.json(
      success("User updated successfully", formatUserForAdmin(updated))
    );
  } catch (err) {
    captureError(err, "updateUser");
    return next(err);
  }
};

export const toggleUserStatusHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = ToggleUserParamSchema.parse(req.params);
    const user = await toggleUserStatus(Number(id));

    logUserToggled(user.id, user.status);

    return res.json(
      success(`User ${user.status ? "activated" : "deactivated"}`, formatUserForAdmin(user))
    );
  } catch (err) {
    captureError(err, "toggleUserStatus");
    return next(err);
  }
};

export const deleteUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = DeleteUserParamSchema.parse(req.params);
    const user = await softDeleteUser(Number(id));

    logUserDeleted(user.id);

    return res.json(
      success("User deleted successfully", formatUserForAdmin(user))
    );
  } catch (err) {
    captureError(err, "deleteUser");
    return next(err);
  }
};
