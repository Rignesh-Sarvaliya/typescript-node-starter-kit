import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { createServer, Server } from 'http';

export const startAdminNotificationService = async (): Promise<Server> => {
  const app = express();
  const httpServer = createServer(app);

  app.use(helmet());
  app.use(compression());
  app.use(express.json());

  app.get('/api/admin/notifications', (_req, res) => {
    res.json({ message: 'Admin notifications placeholder' });
  });

  const PORT = process.env.ADMIN_NOTIFICATION_PORT || 4012;
  await new Promise<void>((resolve) => {
    httpServer.listen(PORT, () => {
      console.log(`Admin notification service running on http://localhost:${PORT}`);
      resolve();
    });
  });

  return httpServer;
};

if (require.main === module) {
  startAdminNotificationService();
}
