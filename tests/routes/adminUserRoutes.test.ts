import { createAuthTestServer, AuthTestServer } from '@tests/helpers/expressAuthTestHelper';
import adminUserRoutes from '@/routes/admin/user';
import * as userService from '@/services/user.service';

jest.mock('@/services/user.service');

let server: AuthTestServer;

beforeAll(() => {
  server = createAuthTestServer(adminUserRoutes, true, '/api/admin/user', 'admin');
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Admin User Routes', () => {
  describe('GET /api/admin/user/users', () => {
    it('should list users', async () => {
      (userService.getAllUsers as jest.Mock).mockResolvedValueOnce([]);
      const res = await server.request.get('/api/admin/user/users');
      expect(res.status).toBe(200);
    });

    it('should return 401 without admin auth', async () => {
      const unauth = createAuthTestServer(adminUserRoutes, false, '/api/admin/user', 'admin');
      const res = await unauth.request.get('/api/admin/user/users');
      expect(res.status).toBe(401);
    });

    it('should handle server errors', async () => {
      (userService.getAllUsers as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const res = await server.request.get('/api/admin/user/users');
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/admin/user/users/:id/update', () => {
    it('should update user', async () => {
      (userService.updateUserById as jest.Mock).mockResolvedValueOnce({ id: 1 });
      const res = await server.request
        .post('/api/admin/user/users/1/update')
        .send({ name: 'John' });
      expect(res.status).toBe(200);
    });

    it('should return 422 for invalid params', async () => {
      const res = await server.request
        .post('/api/admin/user/users/bad/update')
        .send({ name: 'John' });
      expect(res.status).toBe(422);
    });

    it('should handle server errors', async () => {
      (userService.updateUserById as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const res = await server.request
        .post('/api/admin/user/users/1/update')
        .send({ name: 'John' });
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/admin/user/users/:id/toggle', () => {
    it('should toggle user status', async () => {
      (userService.toggleUserStatus as jest.Mock).mockResolvedValueOnce({ id: 1, status: true });
      const res = await server.request.get('/api/admin/user/users/1/toggle');
      expect(res.status).toBe(200);
    });

    it('should return 422 for invalid id', async () => {
      const res = await server.request.get('/api/admin/user/users/bad/toggle');
      expect(res.status).toBe(422);
    });

    it('should handle server errors', async () => {
      (userService.toggleUserStatus as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const res = await server.request.get('/api/admin/user/users/1/toggle');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/admin/user/users/:id/delete', () => {
    it('should delete user', async () => {
      (userService.softDeleteUser as jest.Mock).mockResolvedValueOnce({ id: 1 });
      const res = await server.request.get('/api/admin/user/users/1/delete');
      expect(res.status).toBe(200);
    });

    it('should return 422 for invalid id', async () => {
      const res = await server.request.get('/api/admin/user/users/abc/delete');
      expect(res.status).toBe(422);
    });

    it('should handle server errors', async () => {
      (userService.softDeleteUser as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const res = await server.request.get('/api/admin/user/users/1/delete');
      expect(res.status).toBe(500);
    });
  });
});
