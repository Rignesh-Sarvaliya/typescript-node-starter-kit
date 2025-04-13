import { Request, Response, NextFunction } from "express";
import { Messages } from "../constants/messages";

export const requireUserAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.user || req.session.user.role !== "user") {
    return res.status(401).json({ message: Messages.unauthorized });
  }

  req.user = req.session.user;
  next();
};

export const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.user || req.session.user.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = req.session.user;
  next();
};
