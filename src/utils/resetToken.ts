import { randomUUID } from "crypto";
import { redisClient } from "../config/redis.config";
import { ResetPasswordConstants } from "../constants/reset";

export const generateResetToken = async (userId: number): Promise<string> => {
  const token = randomUUID();
  const key = `${ResetPasswordConstants.keyPrefix}${token}`;
  await redisClient.set(key, userId.toString(), "EX", ResetPasswordConstants.expirySeconds);
  return token;
};

export const getUserIdFromToken = async (token: string) => {
  return redisClient.get(`${ResetPasswordConstants.keyPrefix}${token}`);
};
