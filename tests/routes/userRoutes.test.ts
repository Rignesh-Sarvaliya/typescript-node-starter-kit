import { createAuthTestServer, AuthTestServer } from '../helpers/expressAuthTestHelper';
import userRoutes from '../../src/api/user.routes';
import * as userRepo from '../../src/repositories/user.repository';
import * as notifRepo from '../../src/repositories/notification.repository';

jest.mock('../../src/repositories/user.repository');
jest.mock('../../src/repositories/notification.repository');

let server: AuthTestServer;

beforeAll(() => {
  server = createAuthTestServer(userRoutes);
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe('User Router', () => {
  it('should mount /auth routes', async () => {
    const res = await server.request.post('/auth/login').send({ email: 'a@b.com', password: 'secret123' });
    expect(res.status).not.toBe(404);
  });

  it('should mount /user/me route', async () => {
    (userRepo.findUserById as jest.Mock).mockResolvedValueOnce({ id:1, name:'J', email:'a@b.com' });
    const res = await server.request.get('/user/me');
    expect(res.status).not.toBe(404);
  });

  it('should mount notification routes', async () => {
    (notifRepo.findUserNotifications as jest.Mock).mockResolvedValueOnce([]);
    const res = await server.request.get('/user/notifications');
    expect(res.status).not.toBe(404);
  });
});
