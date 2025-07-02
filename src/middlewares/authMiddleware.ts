import { Request, Response, NextFunction } from "express";
import { Messages } from "../constants/messages";

export const requireUserAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    !(req.session as any)?.user ||
    (req.session as any).user.role !== "user"
  ) {
    return res.status(401).json({ message: Messages.unauthorized });
  }

  (req as any).user = (req.session as any).user;
  next();
};

export const requireAdminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    !(req.session as any)?.user ||
    (req.session as any).user.role !== "admin"
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  (req as any).user = (req.session as any).user;
  next();
};
