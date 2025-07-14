import { createAuthTestServer, AuthTestServer } from '../helpers/expressAuthTestHelper';
import profileRoutes from '../../src/routes/user/profile';
import * as userRepo from '../../src/repositories/user.repository';

jest.mock('../../src/repositories/user.repository');

let server: AuthTestServer;

beforeAll(() => {
  server = createAuthTestServer(profileRoutes, true, '/api/user');
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Profile Routes', () => {
  describe('GET /api/user/me', () => {
    it('should return profile for authenticated user', async () => {
      (userRepo.findUserById as jest.Mock).mockResolvedValueOnce({ id: 1, name: 'John', email: 'john@example.com' });
      const res = await server.request.get('/api/user/me');
      expect(res.status).toBe(200);
    });

    it('should return 404 when user not found', async () => {
      (userRepo.findUserById as jest.Mock).mockResolvedValueOnce(null);
      const res = await server.request.get('/api/user/me');
      expect(res.status).toBe(404);
    });

    it('should return 401 without session', async () => {
      const unauth = createAuthTestServer(profileRoutes, false, '/api/user');
      const res = await unauth.request.get('/api/user/me');
      expect(res.status).toBe(401);
    });

    it('should handle server errors', async () => {
      (userRepo.findUserById as jest.Mock).mockRejectedValueOnce(new Error('db'));
      const res = await server.request.get('/api/user/me');
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/user/update', () => {
    it('should update user profile', async () => {
      (userRepo.updateUserById as jest.Mock).mockResolvedValueOnce({ id: 1, name: 'John', email: 'john@example.com' });
      const res = await server.request.post('/api/user/update').send({ name: 'John', email: 'john@example.com' });
      expect(res.status).toBe(200);
    });

    it('should return 422 for invalid payload', async () => {
      const res = await server.request.post('/api/user/update').send({ name: 'J', email: 'bad' });
      expect(res.status).toBe(422);
    });

    it('should handle server errors', async () => {
      (userRepo.updateUserById as jest.Mock).mockRejectedValueOnce(new Error('db'));
      const res = await server.request.post('/api/user/update').send({ name: 'John', email: 'john@example.com' });
      expect(res.status).toBe(500);
    });
  });
});
