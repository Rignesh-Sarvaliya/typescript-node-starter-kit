import { redisClient } from "../config/redis.config";

const ATTEMPT_PREFIX = "password_attempt:";
const ATTEMPT_LIMIT = 5;
const BLOCK_DURATION = 60 * 5; // 5 minutes

// In-memory attempt store for development
const attemptStore = new Map<string, { count: number; expiry: number }>();

export const getAttemptKey = (userId: number) => `${ATTEMPT_PREFIX}${userId}`;

export const recordFailedAttempt = async (userId: number) => {
  const key = getAttemptKey(userId);

  if (redisClient && process.env.NODE_ENV === "production") {
    const current = await redisClient.incr(key);
    if (current === 1) {
      await redisClient.expire(key, BLOCK_DURATION);
    }
    return current;
  } else {
    // Use in-memory store for development
    const now = Date.now();
    const record = attemptStore.get(key);

    if (!record || now > record.expiry) {
      const expiry = now + BLOCK_DURATION * 1000;
      attemptStore.set(key, { count: 1, expiry });
      return 1;
    } else {
      record.count++;
      return record.count;
    }
  }
};

export const clearFailedAttempts = async (userId: number) => {
  const key = getAttemptKey(userId);

  if (redisClient && process.env.NODE_ENV === "production") {
    await redisClient.del(key);
  } else {
    attemptStore.delete(key);
  }
};

export const isBlocked = async (userId: number): Promise<boolean> => {
  const key = getAttemptKey(userId);

  if (redisClient && process.env.NODE_ENV === "production") {
    const attempts = Number(await redisClient.get(key)) || 0;
    return attempts >= ATTEMPT_LIMIT;
  } else {
    // Use in-memory store for development
    const record = attemptStore.get(key);
    if (record && Date.now() < record.expiry) {
      return record.count >= ATTEMPT_LIMIT;
    }
    return false;
  }
};

export const clearAllUserSessionKeys = async (userId: number) => {
  if (redisClient && process.env.NODE_ENV === "production") {
    await redisClient.del(`password_attempt:${userId}`);
    await redisClient.del(`otp_attempt:${userId}`);
  } else {
    attemptStore.delete(`password_attempt:${userId}`);
    attemptStore.delete(`otp_attempt:${userId}`);
  }
};
