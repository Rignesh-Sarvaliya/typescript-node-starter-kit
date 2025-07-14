import express from "express";
import helmet from "helmet";
import compression from "compression";
import { createServer } from "http";
import session from "express-session";
import { logger } from "./utils/logger";
import { redisClient } from "./config/redis.config";
import RedisStore from "connect-redis";
import { isProduction } from "./config/env";
import { loadLocales } from "./utils/i18n";
// import { errorHandler } from "./middlewares/errorHandler";
import corsConfig from "./config/cors.config";
import sessionConfig from "./config/session.config";
import { globalRateLimiter } from "./middlewares/globalRateLimiter";
import { globalErrorHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/requestLogger";
import { success, error } from "./utils/responseWrapper";
// import "../events/listeners/user.listener";
// import "../events/listeners/admin.listener";

// Routes
import userRoutes from "./api/user.routes";
import adminRoutes from "./api/admin.routes";
import healthRoutes from "./api/health.routes";
import docsRoutes from "./api/docs.routes";
import bullBoardRoutes from "./api/bull.routes";
import resetViewRoutes from "./routes/reset.view";

import type { Server } from "http";

export const startServer = async (): Promise<Server> => {
  const app = express();
  const httpServer = createServer(app);

  // Try to connect to Redis, but don't fail if it's not available
  let redisStore: any = undefined;
  if (redisClient && isProduction) {
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
      logger.error("res.setHeader is not a function!", res);
      return res.status(500).json(error("res.setHeader is not a function"));
    }
    next();
  });
  app.use(corsConfig);
  app.use(helmet());
  app.use(compression());
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
    res.status(200).json(success("Hello World"));
  });

  // Password reset view
  app.use("/", resetViewRoutes);

  // Health check
  app.use("/api/health", healthRoutes);

  // User routes
  app.use("/api/user", userRoutes);
  app.use("/api/admin", adminRoutes);
  // app.use("/api/docs", docsRoutes);
  // app.use("/api/admin/queues", bullBoardRoutes);

  // Error handler (should be last)
  app.use(globalErrorHandler);

  const PORT = process.env.PORT || 3000;
  await new Promise<void>((resolve) => {
    httpServer.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      resolve();
    });
  });

  return httpServer;
};
