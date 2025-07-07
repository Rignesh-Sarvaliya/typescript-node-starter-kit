import { createAuthTestServer, AuthTestServer } from '../helpers/expressAuthTestHelper';
import passwordRoutes from '../../src/routes/user/password';
import * as userRepo from '../../src/repositories/user.repository';
import * as hashUtils from '../../src/utils/hash';
import * as attemptUtils from '../../src/utils/passwordAttempt';
import * as passwordJobs from '../../src/jobs/password.jobs';
import { userEmitter } from '../../src/events/emitters/userEmitter';

jest.mock('../../src/repositories/user.repository');
jest.mock('../../src/utils/hash');
jest.mock('../../src/utils/passwordAttempt');
jest.mock('../../src/jobs/password.jobs');

let server: AuthTestServer;

beforeAll(() => {
  server = createAuthTestServer(passwordRoutes);
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Password Routes', () => {
  describe('POST /user/change/password', () => {
    it('should change password successfully', async () => {
      (attemptUtils.isBlocked as jest.Mock).mockResolvedValueOnce(false);
      (userRepo.findUserWithPasswordById as jest.Mock).mockResolvedValueOnce({ id: 1, password: 'hashed' });
      (hashUtils.comparePassword as jest.Mock).mockResolvedValueOnce(true);
      (hashUtils.hashPassword as jest.Mock).mockResolvedValueOnce('newhash');
      const res = await server.request
        .post('/user/change/password')
        .send({ current_password: 'oldpass', new_password: 'newpass' });
      expect(res.status).toBe(200);
    });

    it('should return 422 for invalid payload', async () => {
      const res = await server.request.post('/user/change/password').send({ current_password: '1', new_password: '2' });
      expect(res.status).toBe(422);
    });

    it('should return 429 when blocked', async () => {
      (attemptUtils.isBlocked as jest.Mock).mockResolvedValueOnce(true);
      const res = await server.request
        .post('/user/change/password')
        .send({ current_password: 'oldpass', new_password: 'newpass' });
      expect(res.status).toBe(429);
    });

    it('should return 404 when user not found', async () => {
      (attemptUtils.isBlocked as jest.Mock).mockResolvedValueOnce(false);
      (userRepo.findUserWithPasswordById as jest.Mock).mockResolvedValueOnce(null);
      const res = await server.request
        .post('/user/change/password')
        .send({ current_password: 'oldpass', new_password: 'newpass' });
      expect(res.status).toBe(404);
    });

    it('should return 401 when password mismatch', async () => {
      (attemptUtils.isBlocked as jest.Mock).mockResolvedValueOnce(false);
      (userRepo.findUserWithPasswordById as jest.Mock).mockResolvedValueOnce({ id: 1, password: 'hashed' });
      (hashUtils.comparePassword as jest.Mock).mockResolvedValueOnce(false);
      const res = await server.request
        .post('/user/change/password')
        .send({ current_password: 'oldpass', new_password: 'newpass' });
      expect(res.status).toBe(401);
    });

    it('should return 401 without session', async () => {
      const unauth = createAuthTestServer(passwordRoutes, false);
      const res = await unauth.request
        .post('/user/change/password')
        .send({ current_password: 'oldpass', new_password: 'newpass' });
      expect(res.status).toBe(401);
    });

    it('should handle server errors', async () => {
      (attemptUtils.isBlocked as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const res = await server.request
        .post('/user/change/password')
        .send({ current_password: 'oldpass', new_password: 'newpass' });
      expect(res.status).toBe(500);
    });
  });
});
