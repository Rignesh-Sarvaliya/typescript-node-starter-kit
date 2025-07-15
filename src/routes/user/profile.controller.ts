import { Request, Response } from "express";
import { findUserById } from "../../repositories/user.repository";
import { formatUserResponse } from "../../resources/user/user.resource";
import { Messages } from "../../constants/messages";
import { captureError } from "../../telemetry/sentry";
import { Email } from "../../domain/valueObjects/email.vo";
import { Name } from "../../domain/valueObjects/name.vo";
import { UpdateProfileRequestSchema } from "../../requests/user/profile.request";
import { updateUserById } from "../../repositories/user.repository";
import { logUserUpdate } from "../../jobs/profile.jobs";
import { success, error } from "../../utils/responseWrapper";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await findUserById(userId!);

    if (!user) {
      return res.status(404).json({ message: Messages.userNotFound });
    }

    // return res.json({ user: formatUserResponse(user) });
    return res.json(success(formatUserResponse(user), "User fetched successfully"));
  } catch (err) {
    captureError(err, "getProfile");
    // return res.status(500).json({ message: "Server error" });
    return res.fail("Failed to load profile");

  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id!;
    const body = UpdateProfileRequestSchema.parse(req.body);

    const name = new Name(body.name);
    const email = new Email(body.email);

    const updatedUser = await updateUserById(userId, {
      name: name.getValue(),
      email: email.getValue(),
    });

    logUserUpdate(userId, email.getValue());

    return res.json({
      message: "Profile updated successfully",
      user: formatUserResponse(updatedUser),
    });
  } catch (error) {
    captureError(error, "updateProfile");
    return res.fail("Update failed");
  }
};