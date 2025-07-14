import { createTestServer, TestServer } from '../helpers/expressTestHelper';

const mockFindFirst = jest.fn();

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      appSetting: { findFirst: mockFindFirst },
    })),
  };
});

import initRoutes from '../../src/routes/user/init';

let server: TestServer;

beforeAll(() => {
  server = createTestServer(initRoutes, '/api/user');
});

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

    const res = await server.request.get('/api/user/init/1.0.0/android');
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

    const res = await server.request.get('/api/user/init/1.0.0/android');
    expect(res.statusCode).toBe(404);
  });

  it('should return 422 for invalid params', async () => {
    const res = await server.request.get('/api/user/init/bad-version/android');
    expect(res.statusCode).toBe(422);
  });

  it('should handle server errors', async () => {
    mockFindFirst.mockRejectedValueOnce(new Error('db error'));
    const res = await server.request.get('/api/user/init/1.0.0/android');
    expect(res.statusCode).toBe(500);
  });
});
