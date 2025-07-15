import { Request, Response, NextFunction } from "express";
import {
  findUserById,
  updateUserById,
} from "../../repositories/user.repository";
import { formatUserResponse } from "../../resources/user/user.resource";
import { Messages } from "../../constants/messages";
import { captureError } from "../../telemetry/sentry";
import { Email } from "../../domain/valueObjects/email.vo";
import { Name } from "../../domain/valueObjects/name.vo";
import { UserEntity } from "../../domain/entities/user.entity";
import { UpdateProfileRequestSchema } from "../../resources/user/profile.request";
import { logUserUpdate } from "../../jobs/profile.jobs";
import { success, error } from "../../utils/responseWrapper";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const user = await findUserById(userId!);

    if (!user) {
      return res.status(404).json(error(Messages.userNotFound));
    }

    // return res.json({ user: formatUserResponse(user) });
    return res.json(success("User fetched successfully", formatUserResponse(user)));
  } catch (err) {
    captureError(err, "getProfile");
    return next(err);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    // Convert raw database object to UserEntity
    const userEntity = new UserEntity(
      updatedUser.id,
      updatedUser.name,
      updatedUser.email
    );

    return res.json(
      success("Profile updated successfully", formatUserResponse(userEntity))
    );
  } catch (err) {
    captureError(err, "updateProfile");
    return next(err);
  }
};
