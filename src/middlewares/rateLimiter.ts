import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";

// In-memory rate limiting fallback
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

let redis: any = null;
// Only use Redis in production
if (process.env.NODE_ENV === "production") {
  try {
    redis = createClient({ url: process.env.REDIS_URL });
    redis.connect();
  } catch (error) {
    console.warn(
      "⚠️ Redis not available for rate limiting, using memory store"
    );
  }
} else {
  console.info("ℹ️ Redis disabled for rate limiting in local development");
}

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

      if (redis && process.env.NODE_ENV === "production") {
        // Use Redis if available
        const current = await redis.incr(key);
        if (current === 1) {
          await redis.expire(key, windowInSeconds);
        }
        if (current > limit) {
          return res.status(429).json({
            message: "Too many requests. Please try again later.",
          });
        }
      } else {
        // Use in-memory store for development
        const now = Date.now();
        const record = rateLimitStore.get(key);

        if (!record || now > record.resetTime) {
          const resetTime = now + windowInSeconds * 1000;
          rateLimitStore.set(key, { count: 1, resetTime });
        } else {
          record.count++;
          if (record.count > limit) {
            return res.status(429).json({
              message: "Too many requests. Please try again later.",
            });
          }
        }
      }

      next();
    } catch (error) {
      console.error("Rate limiter error:", error);
      // Continue without rate limiting if there's an error
      next();
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
