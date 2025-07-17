import { createAuthTestServer, AuthTestServer } from '@tests/helpers/expressAuthTestHelper';
import sessionRoutes from '@/routes/user/session';
import * as sessionUtils from '@/utils/session';
import * as attemptUtils from '@/utils/passwordAttempt';
import * as sessionJobs from '@/jobs/session.jobs';

jest.mock('@/utils/session');
jest.mock('@/utils/passwordAttempt');
jest.mock('@/jobs/session.jobs');

let server: AuthTestServer;

beforeAll(() => {
  server = createAuthTestServer(sessionRoutes, true, '/api/user');
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Session Routes', () => {
  describe('GET /api/user/logout', () => {
    it('should logout successfully', async () => {
      const res = await server.request.get('/api/user/logout');
      expect(res.status).toBe(200);
    });

    it('should return 401 without session', async () => {
      const unauth = createAuthTestServer(sessionRoutes, false, '/api/user');
      const res = await unauth.request.get('/api/user/logout');
      expect(res.status).toBe(401);
    });

    it('should handle server errors', async () => {
      (sessionUtils.destroySession as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const res = await server.request.get('/api/user/logout');
      expect(res.status).toBe(500);
    });
  });
});
