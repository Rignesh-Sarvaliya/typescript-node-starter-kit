import { createAuthTestServer, AuthTestServer } from '../helpers/expressAuthTestHelper';
import userRoutes from '../../src/api/user.routes';
import * as userRepo from '../../src/repositories/user.repository';
import * as notifRepo from '../../src/repositories/notification.repository';

jest.mock('../../src/repositories/user.repository');
jest.mock('../../src/repositories/notification.repository');

let server: AuthTestServer;

beforeAll(() => {
  server = createAuthTestServer(userRoutes, true, '/api/user');
});

beforeEach(() => {
  jest.resetAllMocks();
  (userRepo.findUserByEmail as jest.Mock).mockResolvedValue({
    id: 1,
    name: 'John',
    email: 'a@b.com',
    password: 'secret123',
  });
});

describe('User Router', () => {
  it('should mount /api/user/auth routes', async () => {
    const res = await server.request.post('/api/user/auth/login').send({ email: 'a@b.com', password: 'secret123' });
    expect(res.status).not.toBe(404);
  });

  it('should mount /user/me route', async () => {
    (userRepo.findUserById as jest.Mock).mockResolvedValueOnce({ id:1, name:'J', email:'a@b.com' });
    const res = await server.request.get('/api/user/me');
    expect(res.status).not.toBe(404);
  });

  it('should mount notification routes', async () => {
    (notifRepo.findUserNotifications as jest.Mock).mockResolvedValueOnce([]);
    const res = await server.request.get('/api/user/notifications');
    expect(res.status).not.toBe(404);
  });
});
