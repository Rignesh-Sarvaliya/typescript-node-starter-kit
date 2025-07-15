import { Request, Response, NextFunction } from "express";
import { Messages } from "../constants/messages";

export const requireUserAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.user || req.session.user.role !== "user") {
    return res.unauthorized(Messages.unauthorized);
  }

  req.user = req.session.user;
  next();
};

export const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.user || req.session.user.role !== "admin") {
    return res.unauthorized("Unauthorized");
  }

  req.user = req.session.user;
  next();
};
