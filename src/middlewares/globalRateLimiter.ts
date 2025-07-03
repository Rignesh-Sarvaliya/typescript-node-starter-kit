import { Request, Response, NextFunction } from "express";
import { createClient } from "redis";

// In-memory rate limiting fallback
const memoryStore = new Map<string, { count: number; resetTime: number }>();

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

    if (redis) {
      // Use Redis if available
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
    } else {
      // Use in-memory store as fallback
      const now = Date.now();
      const key = `${path}:${identifier}`;
      const record = memoryStore.get(key);

      if (!record || now > record.resetTime) {
        memoryStore.set(key, { count: 1, resetTime: now + window * 1000 });
      } else {
        record.count++;
        if (record.count > limit) {
          return res.status(429).json({
            message: "Too many requests — please slow down.",
            route: path,
            retry_after: window,
          });
        }
      }
    }

    next();
  } catch (error) {
    console.error("❌ RateLimiter error:", error);
    // Continue without rate limiting if there's an error
    next();
  }
};
