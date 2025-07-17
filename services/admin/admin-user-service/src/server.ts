import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { createServer, Server } from 'http';
import userRoutes from '../../../../src/routes/admin/user';
import exportRoutes from '../../../../src/routes/admin/export';
import { globalErrorHandler } from '../../../../src/middlewares/errorHandler';

export const startAdminUserService = async (): Promise<Server> => {
  const app = express();
  const httpServer = createServer(app);

  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use('/api/admin/user', userRoutes);
  app.use('/api/admin/user', exportRoutes);
  app.use(globalErrorHandler);

  const PORT = process.env.ADMIN_USER_PORT || 4011;
  await new Promise<void>((resolve) => {
    httpServer.listen(PORT, () => {
      console.log(`Admin user service running on http://localhost:${PORT}`);
      resolve();
    });
  });

  return httpServer;
};

if (require.main === module) {
  startAdminUserService();
}
