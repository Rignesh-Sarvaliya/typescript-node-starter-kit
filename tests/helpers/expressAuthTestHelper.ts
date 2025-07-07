import express, { Router } from 'express';
import request, { SuperTest, Test } from 'supertest';

export interface AuthTestServer {
  app: express.Express;
  request: SuperTest<Test>;
}

export const createAuthTestServer = (router: Router, authenticated = true): AuthTestServer => {
  const app = express();
  app.use(express.json());
  if (authenticated) {
    app.use((req, _res, next) => {
      (req as any).session = { user: { id: 1, role: 'user' } };
      next();
    });
  }
  app.use('/', router);
  return { app, request: request(app) };
};
