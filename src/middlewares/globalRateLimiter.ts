import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
redis.connect();

// ⏱ Route-specific limits
const RATE_LIMIT_RULES: Record<string, { limit: number; window: number }> = {
  "/auth/login": { limit: 5, window: 60 },
  "/auth/send/otp": { limit: 3, window: 120 },
  "/auth/forgot/password": { limit: 3, window: 120 },
  "/user/me": { limit: 15, window: 60 },
  "*": { limit: 100, window: 60 }, // default
};

export const globalRateLimiter = async (
  req: Express.Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Workaround: cast req as any to access custom user property and standard properties
    const identifier = (req as any).user?.id || (req as any).ip;
    const path =
      Object.keys(RATE_LIMIT_RULES).find((key) =>
        (req as any).originalUrl.startsWith(key)
      ) || "*";

    const { limit, window } = RATE_LIMIT_RULES[path];
    const redisKey = `rate:${path}:${identifier}`;

    const current = await redis.incr(redisKey);
    if (current === 1) {
      await redis.expire(redisKey, window);
    }

    if (current > limit) {
      return res.status(429).json({
        message: "Too many requests — please slow down.",
        route: path,
        retry_after: window,
      });
    }

    next();
  } catch (error) {
    console.error("❌ RateLimiter error:", error);
    return res.status(500).json({ message: "Rate limiter failed" });
  }
};
