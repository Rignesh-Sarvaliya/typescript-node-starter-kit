import { createTestServer, TestServer } from '@tests/helpers/expressTestHelper';
import authRoutes from '@/routes/user/auth';
import * as userRepo from '@/repositories/user.repository';
import * as hashUtils from '@/utils/hash';
import * as otpUtils from '@/utils/otp';
import * as resetTokenUtils from '@/utils/resetToken';
import { logAppleCheck } from '@/jobs/logAppleCheck';

jest.mock('@/repositories/user.repository');
jest.mock('@/utils/hash');
jest.mock('@/utils/otp');
jest.mock('@/utils/resetToken');
jest.mock('@/jobs/logAppleCheck');

let server: TestServer;

beforeAll(() => {
  server = createTestServer(authRoutes, '/api/user');
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Auth Routes', () => {
  describe('POST /api/user/auth/register', () => {
    it('should register a new user', async () => {
      (userRepo.findUserByEmail as jest.Mock).mockResolvedValueOnce(null);
      (hashUtils.hashPassword as jest.Mock).mockResolvedValueOnce('hashed');
      (userRepo.createUser as jest.Mock).mockResolvedValueOnce({
        id: 1,
        name: 'John',
        email: 'john@example.com',
      });

      const res = await server.request.post('/api/user/auth/register').send({
        name: 'John',
        email: 'john@example.com',
        password: 'secret123',
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User registered successfully');
    });

    it('should return 409 if email exists', async () => {
      (userRepo.findUserByEmail as jest.Mock).mockResolvedValueOnce({ id: 1 });

      const res = await server.request.post('/api/user/auth/register').send({
        name: 'John',
        email: 'john@example.com',
        password: 'secret123',
      });

      expect(res.status).toBe(409);
    });

    it('should return 422 for invalid payload', async () => {
      const res = await server.request.post('/api/user/auth/register').send({
        name: 'J',
        email: 'bad',
        password: '1',
      });

      expect(res.status).toBe(422);
    });

    it('should handle server errors', async () => {
      (userRepo.findUserByEmail as jest.Mock).mockRejectedValueOnce(new Error('db error'));

      const res = await server.request.post('/api/user/auth/register').send({
        name: 'John',
        email: 'john@example.com',
        password: 'secret123',
      });

      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/user/auth/login', () => {
    it('should login successfully', async () => {
      (userRepo.findUserByEmail as jest.Mock).mockResolvedValueOnce({
        id: 1,
        name: 'John',
        email: 'john@example.com',
        password: 'hashed',
      });
      (hashUtils.comparePassword as jest.Mock).mockResolvedValueOnce(true);

      const res = await server.request.post('/api/user/auth/login').send({
        email: 'john@example.com',
        password: 'secret123',
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Login successful');
    });

    it('should return 404 if user not found', async () => {
      (userRepo.findUserByEmail as jest.Mock).mockResolvedValueOnce(null);

      const res = await server.request.post('/api/user/auth/login').send({
        email: 'john@example.com',
        password: 'secret123',
      });

      expect(res.status).toBe(404);
    });

    it('should return 401 for invalid credentials', async () => {
      (userRepo.findUserByEmail as jest.Mock).mockResolvedValueOnce({
        id: 1,
        name: 'John',
        email: 'john@example.com',
        password: 'hashed',
      });
      (hashUtils.comparePassword as jest.Mock).mockResolvedValueOnce(false);

      const res = await server.request.post('/api/user/auth/login').send({
        email: 'john@example.com',
        password: 'secret123',
      });

      expect(res.status).toBe(401);
    });

    it('should return 422 for invalid payload', async () => {
      const res = await server.request.post('/api/user/auth/login').send({
        email: 'bad',
        password: '1',
      });

      expect(res.status).toBe(422);
    });

    it('should handle server errors', async () => {
      (userRepo.findUserByEmail as jest.Mock).mockRejectedValueOnce(new Error('db error'));

      const res = await server.request.post('/api/user/auth/login').send({
        email: 'john@example.com',
        password: 'secret123',
      });

      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/user/auth/social-login', () => {
    it('should return 400 as not supported', async () => {
      const res = await server.request.post('/api/user/auth/social-login').send({
        social_id: 'abc',
        provider: 'google',
        name: 'John',
      });

      expect(res.status).toBe(400);
    });

    it('should return 422 for invalid payload', async () => {
      const res = await server.request.post('/api/user/auth/social-login').send({
        social_id: '',
        provider: 'google',
        name: 'John',
      });
      expect(res.status).toBe(422);
    });

    it('should handle server errors', async () => {
      (logAppleCheck as jest.Mock).mockImplementationOnce(() => { throw new Error('fail'); });
      // call apple route to trigger catch; social-login has no dep to throw
      const res = await server.request.get('/api/user/auth/apple-details/abc');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/user/auth/apple-details/:id', () => {
    it('should return 400 as feature not supported', async () => {
      const res = await server.request.get('/api/user/auth/apple-details/abc');
      expect(res.status).toBe(400);
    });

    it('should return 422 for invalid params', async () => {
      const res = await server.request.get('/api/user/auth/apple-details/ab');
      expect(res.status).toBe(422);
    });

    it('should handle server errors', async () => {
      (logAppleCheck as jest.Mock).mockImplementationOnce(() => { throw new Error('fail'); });
      const res = await server.request.get('/api/user/auth/apple-details/abc');
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/user/auth/send/otp', () => {
    it('should send otp', async () => {
      (otpUtils.generateOtp as jest.Mock).mockReturnValueOnce('123456');
      const res = await server.request.post('/api/user/auth/send/otp').send({ email: 'john@example.com' });
      expect(res.status).toBe(200);
    });

    it('should return 422 for invalid payload', async () => {
      const res = await server.request.post('/api/user/auth/send/otp').send({ email: 'bad' });
      expect(res.status).toBe(422);
    });

    it('should handle server errors', async () => {
      (otpUtils.saveOtpToRedis as jest.Mock).mockRejectedValueOnce(new Error('redis error'));
      const res = await server.request.post('/api/user/auth/send/otp').send({ email: 'john@example.com' });
      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/user/auth/forgot/password', () => {
    it('should send reset link', async () => {
      (userRepo.findUserByEmail as jest.Mock).mockResolvedValueOnce({ id: 1, email: 'john@example.com' });
      (resetTokenUtils.generateResetToken as jest.Mock).mockResolvedValueOnce('token');

      const res = await server.request.post('/api/user/auth/forgot/password').send({ email: 'john@example.com' });
      expect(res.status).toBe(200);
      expect(res.body.resetUrl).toBeDefined();
    });

    it('should return 404 when email not found', async () => {
      (userRepo.findUserByEmail as jest.Mock).mockResolvedValueOnce(null);
      const res = await server.request.post('/api/user/auth/forgot/password').send({ email: 'john@example.com' });
      expect(res.status).toBe(404);
    });

    it('should return 422 for invalid payload', async () => {
      const res = await server.request.post('/api/user/auth/forgot/password').send({ email: 'bad' });
      expect(res.status).toBe(422);
    });

    it('should handle server errors', async () => {
      (userRepo.findUserByEmail as jest.Mock).mockRejectedValueOnce(new Error('db error'));
      const res = await server.request.post('/api/user/auth/forgot/password').send({ email: 'john@example.com' });
      expect(res.status).toBe(500);
    });
  });

  it('should return 404 for unknown route', async () => {
    const res = await server.request.get('/api/user/unknown');
    expect(res.status).toBe(404);
  });
});
