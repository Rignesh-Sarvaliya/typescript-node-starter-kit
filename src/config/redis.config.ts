// Conditional Redis import to avoid connection attempts in development
import { isProduction } from "./env";
import { logger } from "../utils/logger";

let redisClient: any = null;

if (isProduction) {
  const Redis = require("ioredis");
  redisClient = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  });
  logger.info("✅ Redis client created for production");
} else {
  logger.info("ℹ️ Redis client disabled for development");
}

export { redisClient };
