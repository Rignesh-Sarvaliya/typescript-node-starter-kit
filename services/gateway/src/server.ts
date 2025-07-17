import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { createServer, Server } from 'http';


function createProxy(target: string) {
  return async (req: express.Request, res: express.Response) => {
    const url = `${target}${req.originalUrl}`;
    const headers: Record<string, any> = { ...req.headers };
    delete headers['host'];
    const init: any = {
      method: req.method,
      headers,
    };
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      init.body = JSON.stringify(req.body);
      if (!headers['content-type']) {
        init.headers = { ...headers, 'content-type': 'application/json' };
      }
    }
    const resp = await fetch(url, init);
    res.status(resp.status);
    resp.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    const data = await resp.text();
    res.send(data);
  };
}

export const startGateway = async (): Promise<Server> => {
  const app = express();
  const httpServer = createServer(app);

  app.use(helmet());
  app.use(compression());
  app.use(express.json());

  app.use('/api/user', createProxy('http://localhost:4001'));
  app.use('/api/admin', createProxy('http://localhost:4002'));

  const PORT = process.env.GATEWAY_PORT || 3000;
  await new Promise<void>((resolve) => {
    httpServer.listen(PORT, () => {
      console.log(`Gateway running on http://localhost:${PORT}`);
      resolve();
    });
  });

  return httpServer;
};

if (require.main === module) {
  startGateway();
}
