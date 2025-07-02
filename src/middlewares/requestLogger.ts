import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  // Finish event is triggered when response is done
  res.on("finish", () => {
    const duration = Date.now() - start;
    const user = (req as any)?.user;
    const label =
      user?.role === "admin"
        ? `admin#${user.id}`
        : user?.role === "user"
        ? `user#${user.id}`
        : "guest";

    const method = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;

    console.log(`[${label}] ${method} ${url} - ${status} - ${duration}ms`);
  });

  next();
};
