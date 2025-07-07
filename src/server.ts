import express from "express";
import { createServer } from "http";
import session from "express-session";
import { logger } from "./utils/logger";
import { redisClient } from "./config/redis.config";
import RedisStore from "connect-redis";
import { loadLocales } from "./utils/i18n";
// import { errorHandler } from "./middlewares/errorHandler";
import corsConfig from "./config/cors.config";
import sessionConfig from "./config/session.config";
import { globalRateLimiter } from "./middlewares/globalRateLimiter";
import { globalErrorHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/requestLogger";
// import "../events/listeners/user.listener";
// import "../events/listeners/admin.listener";

// Routes
import userRoutes from "./api/user.routes";
import healthRoutes from "./api/health.routes";
import docsRoutes from "./api/docs.routes";
import bullBoardRoutes from "./api/bull.routes";

export const startServer = async () => {
  const app = express();
  const httpServer = createServer(app);

  // Try to connect to Redis, but don't fail if it's not available
  let redisStore: any = undefined;
  if (redisClient && process.env.NODE_ENV === "production") {
    try {
      if (
        redisClient.status !== "ready" &&
        redisClient.status !== "connecting"
      ) {
        await redisClient.connect();
      }
      redisStore = new (RedisStore as any)({ client: redisClient });
      logger.info("✅ Redis connected successfully");
    } catch (error) {
      logger.warn("⚠️ Redis not available, using memory session store");
      redisStore = undefined;
    }
  } else {
    logger.info("ℹ️ Redis disabled for local development");
  }
  // app.use(loadLocales());

  // Middleware
  app.use((req, res, next) => {
    if (typeof res.setHeader !== "function") {
      console.error("res.setHeader is not a function!", res);
      return res
        .status(500)
        .json({ success: false, message: "res.setHeader is not a function" });
    }
    next();
  });
  app.use(corsConfig);
  app.use(express.json());
  // app.use(
  //   session({
  //     store: redisStore,
  //     ...sessionConfig,
  //   })
  // );
  app.use(requestLogger);
  app.use(globalRateLimiter);

  // root route
  app.get("/", (req, res) => {
    // res.status(200).json({ message: "Hello World" });
    res.status(200).json({
      status: true,
      message: "Hello World",
    });
  });

  // Health check
  app.use("/api/health", healthRoutes);

  // User routes
  app.use("/api", userRoutes);
  app.use("/api/docs", docsRoutes);
  app.use("/api/admin/queues", bullBoardRoutes);

  // Error handler (should be last)
  app.use(globalErrorHandler);

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
  });
};
