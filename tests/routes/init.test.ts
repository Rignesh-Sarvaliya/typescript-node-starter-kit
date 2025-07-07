import request from 'supertest';
import express from 'express';

const mockFindFirst = jest.fn();

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      appSetting: { findFirst: mockFindFirst },
    })),
  };
});

import initRoutes from '../../src/routes/user/init';

const app = express();
app.use(express.json());
app.use('/', initRoutes);

describe('Init Routes', () => {
  beforeEach(() => {
    mockFindFirst.mockReset();
  });

  it('should return app settings', async () => {
    const mockSetting = {
      app_type: 'android',
      app_version: 1,
      force_updates: false,
      maintenance_mode: false,
      app_label: 'Test',
    };
    mockFindFirst.mockResolvedValueOnce(mockSetting);

    const res = await request(app).get('/init/1.0.0/android');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      app_type: 'android',
      app_version: 1,
      force_updates: false,
      maintenance_mode: false,
      label: 'Test',
    });
  });

  it('should return 404 when no setting found', async () => {
    mockFindFirst.mockResolvedValueOnce(null);

    const res = await request(app).get('/init/1.0.0/android');
    expect(res.statusCode).toBe(404);
  });
});
