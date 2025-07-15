import { NextFunction, Request, Response } from "express";
import { success, error } from "../utils/responseWrapper";

export const responseHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.ok = function <T>(data: T, message?: string): Response {
    return res.status(200).json(success(data, message));
  };

  res.unauthorized = function (message: string = "Unauthorized"): Response {
    return res.status(401).json(error(message));
  };

  res.fail = function (
    message: string = "Internal server error",
    errors?: any
  ): Response {
    return res.status(500).json(error(message, errors));
  };

  next();
};
