import { redisClient } from "../config/redis.config";

const ATTEMPT_PREFIX = "password_attempt:";
const ATTEMPT_LIMIT = 5;
const BLOCK_DURATION = 60 * 5; // 5 minutes

export const getAttemptKey = (userId: number) => `${ATTEMPT_PREFIX}${userId}`;

export const recordFailedAttempt = async (userId: number) => {
  const key = getAttemptKey(userId);
  const current = await redisClient.incr(key);

  if (current === 1) {
    await redisClient.expire(key, BLOCK_DURATION);
  }

  return current;
};

export const clearFailedAttempts = async (userId: number) => {
  await redisClient.del(getAttemptKey(userId));
};

export const isBlocked = async (userId: number): Promise<boolean> => {
  const key = getAttemptKey(userId);
  const attempts = Number(await redisClient.get(key)) || 0;
  return attempts >= ATTEMPT_LIMIT;
};

export const clearAllUserSessionKeys = async (userId: number) => {
  await redisClient.del(`password_attempt:${userId}`);
  await redisClient.del(`otp_attempt:${userId}`);
};
