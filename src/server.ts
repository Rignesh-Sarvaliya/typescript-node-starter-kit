import express from "express";
import cors from "cors";
import { createServer } from "http";
import session from "express-session";
import { logger } from "./utils/logger";
import { redisClient } from "./config/redis.config";
import RedisStore from "connect-redis";
import { loadLocales } from "./utils/i18n";
import { errorHandler } from "./middlewares/errorHandler";
import corsConfig from "./config/cors.config";
import sessionConfig from "./config/session.config";
import { globalRateLimiter } from "./middlewares/globalRateLimiter";
import { globalErrorHandler } from "./middlewares/errorHandler";
import { requestLogger } from "./middlewares/requestLogger";
import { responseHandler } from "./middlewares/responseHandler";
import "../events/listeners/user.listener";
import "../events/listeners/admin.listener";

// Routes
import userRoutes from "./api/user.routes";
import healthRoutes from "./api/health.routes";
import docsRoutes from "./api/docs.routes";
import bullBoardRoutes from "./api/bull.routes";


export const startServer = async () => {
  const app = express();
  const httpServer = createServer(app);

  await redisClient.connect();

  // Middleware
  app.use(cors(corsConfig));
  app.use(express.json());
  app.use(responseHandler);
  app.use(loadLocales());
  app.use(
    session({
      store: new (RedisStore as any)({ client: redisClient }),
      ...sessionConfig,
    })
  );
  app.use(requestLogger);
  app.use(globalRateLimiter);
  // All route handlers above
  app.use(globalErrorHandler); // last in the stack

  // Health check
  app.use("/api/health", healthRoutes);

  // User routes
  app.use("/api", userRoutes);
  app.use("/api/docs", docsRoutes);
  app.use("/api/admin/queues", bullBoardRoutes);

  // Error handler
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
  });
};
