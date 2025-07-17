import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { createServer, Server } from 'http';
import authRoutes from '../../../../src/routes/user/auth';
import { globalErrorHandler } from '../../../../src/middlewares/errorHandler';

export const startUserAuthService = async (): Promise<Server> => {
  const app = express();
  const httpServer = createServer(app);

  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use('/api/user/auth', authRoutes);
  app.use(globalErrorHandler);

  const PORT = process.env.USER_AUTH_PORT || 4003;
  await new Promise<void>((resolve) => {
    httpServer.listen(PORT, () => {
      console.log(`User auth service running on http://localhost:${PORT}`);
      resolve();
    });
  });

  return httpServer;
};

if (require.main === module) {
  startUserAuthService();
}
