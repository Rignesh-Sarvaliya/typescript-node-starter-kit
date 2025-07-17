import { createAuthTestServer, AuthTestServer } from '@tests/helpers/expressAuthTestHelper';
import notificationRoutes from '@/routes/user/notification';
import * as notifRepo from '@/repositories/notification.repository';
import * as notifJobs from '@/jobs/notification.jobs';

jest.mock('@/repositories/notification.repository');
jest.mock('@/jobs/notification.jobs');

let server: AuthTestServer;

beforeAll(() => {
  server = createAuthTestServer(notificationRoutes, true, '/api/user');
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Notification Routes', () => {
  describe('GET /api/user/notifications', () => {
    it('should return notifications', async () => {
      (notifRepo.findUserNotifications as jest.Mock).mockResolvedValueOnce([]);
      const res = await server.request.get('/api/user/notifications');
      expect(res.status).toBe(200);
    });

    it('should return 401 without session', async () => {
      const unauth = createAuthTestServer(notificationRoutes, false, '/api/user');
      const res = await unauth.request.get('/api/user/notifications');
      expect(res.status).toBe(401);
    });

    it('should handle server errors', async () => {
      (notifRepo.findUserNotifications as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const res = await server.request.get('/api/user/notifications');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/user/notifications/status/change/:status', () => {
    it('should update notification status', async () => {
      (notifRepo.updateUserNotificationStatus as jest.Mock).mockResolvedValueOnce(1);
      const res = await server.request.get('/api/user/notifications/status/change/read');
      expect(res.status).toBe(200);
    });

    it('should return 422 for invalid param', async () => {
      const res = await server.request.get('/api/user/notifications/status/change/bad');
      expect(res.status).toBe(422);
    });

    it('should handle server errors', async () => {
      (notifRepo.updateUserNotificationStatus as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const res = await server.request.get('/api/user/notifications/status/change/read');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/user/notifications/clear-all', () => {
    it('should clear notifications', async () => {
      (notifRepo.deleteAllNotificationsForUser as jest.Mock).mockResolvedValueOnce(3);
      const res = await server.request.get('/api/user/notifications/clear-all');
      expect(res.status).toBe(200);
    });

    it('should handle server errors', async () => {
      (notifRepo.deleteAllNotificationsForUser as jest.Mock).mockRejectedValueOnce(new Error('fail'));
      const res = await server.request.get('/api/user/notifications/clear-all');
      expect(res.status).toBe(500);
    });
  });
});
