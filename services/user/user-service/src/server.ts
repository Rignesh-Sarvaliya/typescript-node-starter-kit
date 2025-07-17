import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { createServer, Server } from 'http';
import userRoutes from '../../../../src/api/user.routes';
import { globalErrorHandler } from '../../../../src/middlewares/errorHandler';

export const startUserService = async (): Promise<Server> => {
  const app = express();
  const httpServer = createServer(app);

  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use('/api/user', userRoutes);
  app.use(globalErrorHandler);

  const PORT = process.env.USER_PORT || 4001;
  await new Promise<void>((resolve) => {
    httpServer.listen(PORT, () => {
      console.log(`User service running on http://localhost:${PORT}`);
      resolve();
    });
  });

  return httpServer;
};

if (require.main === module) {
  startUserService();
}
