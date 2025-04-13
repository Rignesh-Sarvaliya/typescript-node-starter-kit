import { Request, Response } from "express";
import { getAllUsers } from "../../repositories/user.repository";
import { formatUserListForAdmin } from "../../resources/admin/user.resource";
import { captureError } from "../../telemetry/sentry";
import {
  UpdateUserParamSchema,
  UpdateUserBodySchema,
} from "../../requests/admin/user.request";
import { updateUserById } from "../../repositories/user.repository";
import { logUserUpdated } from "../../jobs/user.jobs";
import { formatUserForAdmin } from "../../resources/admin/user.resource";
import { DeleteUserParamSchema } from "../../requests/admin/user.request";
import { softDeleteUser } from "../../repositories/user.repository";
import { logUserDeleted } from "../../jobs/user.jobs";

export const getAllUsersHandler = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    return res.json({ users: formatUserListForAdmin(users) });
  } catch (error) {
    captureError(error, "getAllUsers");
    return res.status(500).json({ message: "Failed to load users" });
  }
};

export const updateUserById = async (
  id: number,
  data: { name?: string; email?: string; status?: boolean }
) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};


export const updateUserHandler = async (req: Request, res: Response) => {
  try {
    const { id } = UpdateUserParamSchema.parse(req.params);
    const body = UpdateUserBodySchema.parse(req.body);

    const updated = await updateUserById(Number(id), body);

    logUserUpdated(Number(id));

    return res.json({
      message: "User updated successfully",
      user: formatUserForAdmin(updated),
    });
  } catch (error) {
    captureError(error, "updateUser");
    return res.status(500).json({ message: "Failed to update user" });
  }
};

import { ToggleUserParamSchema } from "../../requests/admin/user.request";
import { toggleUserStatus } from "../../repositories/user.repository";
import { logUserToggled } from "../../jobs/user.jobs";

export const toggleUserStatusHandler = async (req: Request, res: Response) => {
  try {
    const { id } = ToggleUserParamSchema.parse(req.params);
    const user = await toggleUserSstatus(Number(id));

    logUserToggled(user.id, user.status);

    return res.json({
      message: `User ${user.status ? "activated" : "deactivated"}`,
      user: formatUserForAdmin(user),
    });
  } catch (error) {
    captureError(error, "toggleUserStatus");
    return res.status(500).json({ message: "Failed to toggle user" });
  }
};


export const deleteUserHandler = async (req: Request, res: Response) => {
  try {
    const { id } = DeleteUserParamSchema.parse(req.params);
    const user = await softDeleteUser(Number(id));

    logUserDeleted(user.id);

    return res.json({
      message: "User deleted successfully",
      user: formatUserForAdmin(user),
    });
  } catch (error) {
    captureError(error, "deleteUser");
    return res.status(500).json({ message: "Failed to delete user" });
  }
};
