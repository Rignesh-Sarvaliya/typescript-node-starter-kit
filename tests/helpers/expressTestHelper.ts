import express, { Router } from 'express';
import request, { SuperTest, Test } from 'supertest';

export interface TestServer {
  app: express.Express;
  request: SuperTest<Test>;
}

export const createTestServer = (router: Router): TestServer => {
  const app = express();
  app.use(express.json());
  app.use('/', router);
  return { app, request: request(app) };
};

