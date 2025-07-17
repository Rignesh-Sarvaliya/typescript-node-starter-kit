import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { createServer, Server } from 'http';
import adminRoutes from '../../../../src/api/admin.routes';
import { globalErrorHandler } from '../../../../src/middlewares/errorHandler';

export const startAdminService = async (): Promise<Server> => {
  const app = express();
  const httpServer = createServer(app);

  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use('/api/admin', adminRoutes);
  app.use(globalErrorHandler);

  const PORT = process.env.ADMIN_PORT || 4002;
  await new Promise<void>((resolve) => {
    httpServer.listen(PORT, () => {
      console.log(`Admin service running on http://localhost:${PORT}`);
      resolve();
    });
  });

  return httpServer;
};

if (require.main === module) {
  startAdminService();
}
