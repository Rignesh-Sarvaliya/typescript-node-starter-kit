import { createAuthTestServer, AuthTestServer } from '@tests/helpers/expressAuthTestHelper';
import adminProfileRoutes from '@/routes/admin/profile';
import * as adminRepo from '@/repositories/admin.repository';

jest.mock('@/repositories/admin.repository');

let server: AuthTestServer;

beforeAll(() => {
  server = createAuthTestServer(adminProfileRoutes, true, '/api/admin', 'admin');
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Admin Profile Routes', () => {
  describe('GET /api/admin/me', () => {
    it('should return admin profile', async () => {
      (adminRepo.findAdminById as jest.Mock).mockResolvedValueOnce({ id: 1, name: 'Admin', email: 'a@b.com' });
      const res = await server.request.get('/api/admin/me');
      expect(res.status).toBe(200);
    });

    it('should return 404 when admin not found', async () => {
      (adminRepo.findAdminById as jest.Mock).mockResolvedValueOnce(null);
      const res = await server.request.get('/api/admin/me');
      expect(res.status).toBe(404);
    });

    it('should return 401 without session', async () => {
      const unauth = createAuthTestServer(adminProfileRoutes, false, '/api/admin', 'admin');
      const res = await unauth.request.get('/api/admin/me');
      expect(res.status).toBe(401);
    });

    it('should handle server errors', async () => {
      (adminRepo.findAdminById as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const res = await server.request.get('/api/admin/me');
      expect(res.status).toBe(500);
    });
  });
});
