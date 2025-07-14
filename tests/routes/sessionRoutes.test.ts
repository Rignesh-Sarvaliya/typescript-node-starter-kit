import { createAuthTestServer, AuthTestServer } from '../helpers/expressAuthTestHelper';
import sessionRoutes from '../../src/routes/user/session';
import * as sessionUtils from '../../src/utils/session';
import * as attemptUtils from '../../src/utils/passwordAttempt';
import * as sessionJobs from '../../src/jobs/session.jobs';

jest.mock('../../src/utils/session');
jest.mock('../../src/utils/passwordAttempt');
jest.mock('../../src/jobs/session.jobs');

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
