import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
redis.connect();

export const rateLimiter = ({
  keyPrefix,
  limit = 5,
  windowInSeconds = 60,
}: {
  keyPrefix: string;
  limit?: number;
  windowInSeconds?: number;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const identifier = req.user?.id || req.ip || "unknown";
      const key = `${keyPrefix}:${identifier}`;
      const current = await redis.incr(key);

      if (current === 1) {
        await redis.expire(key, windowInSeconds);
      }

      if (current > limit) {
        return res.status(429).json({
          message: "Too many requests. Please try again later.",
        });
      }

      next();
    } catch (error) {
      console.error("Rate limiter error:", error);
      return res.fail("Rate limiting failed");
    }
  };
};


// import { rateLimiter } from "../../middlewares/rateLimiter";

// router.post(
//   "/auth/login",
//   rateLimiter({ keyPrefix: "login", limit: 5, windowInSeconds: 60 }),
//   validateRequest({ body: LoginRequestSchema }),
//   authController.loginUser
// );

// router.post(
//   "/auth/send/otp",
//   rateLimiter({ keyPrefix: "otp", limit: 3, windowInSeconds: 120 }),
//   validateRequest({ body: OtpRequestSchema }),
//   authController.sendOtp
// );