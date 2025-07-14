import { createTestServer, TestServer } from '../helpers/expressTestHelper';
import adminAuthRoutes from '../../src/routes/admin/auth';
import * as adminRepo from '../../src/repositories/admin.repository';
import * as hashUtils from '../../src/utils/hash';
import * as sessionUtils from '../../src/utils/session';

jest.mock('../../src/repositories/admin.repository');
jest.mock('../../src/utils/hash');
jest.mock('../../src/utils/session');

let server: TestServer;

beforeAll(() => {
  server = createTestServer(adminAuthRoutes, '/api/admin/auth');
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Admin Auth Routes', () => {
  describe('POST /api/admin/auth/login', () => {
    it('should login admin successfully', async () => {
      (adminRepo.findAdminByEmail as jest.Mock).mockResolvedValueOnce({
        id: 1,
        name: 'Admin',
        email: 'admin@example.com',
        password: 'hashed',
      });
      (hashUtils.comparePassword as jest.Mock).mockResolvedValueOnce(true);
      (sessionUtils.generateSession as jest.Mock).mockResolvedValueOnce(null);
      const res = await server.request.post('/api/admin/auth/login').send({
        email: 'admin@example.com',
        password: 'secret123',
      });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Login successful');
    });

    it('should return 404 when admin not found', async () => {
      (adminRepo.findAdminByEmail as jest.Mock).mockResolvedValueOnce(null);
      const res = await server.request.post('/api/admin/auth/login').send({
        email: 'admin@example.com',
        password: 'secret123',
      });
      expect(res.status).toBe(404);
    });

    it('should return 401 for invalid password', async () => {
      (adminRepo.findAdminByEmail as jest.Mock).mockResolvedValueOnce({
        id: 1,
        name: 'Admin',
        email: 'admin@example.com',
        password: 'hashed',
      });
      (hashUtils.comparePassword as jest.Mock).mockResolvedValueOnce(false);
      const res = await server.request.post('/api/admin/auth/login').send({
        email: 'admin@example.com',
        password: 'wrong',
      });
      expect(res.status).toBe(401);
    });

    it('should return 422 for invalid payload', async () => {
      const res = await server.request.post('/api/admin/auth/login').send({
        email: 'bad',
        password: '1',
      });
      expect(res.status).toBe(422);
    });

    it('should handle server errors', async () => {
      (adminRepo.findAdminByEmail as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const res = await server.request.post('/api/admin/auth/login').send({
        email: 'admin@example.com',
        password: 'secret123',
      });
      expect(res.status).toBe(500);
    });
  });
});
