import { randomUUID } from "crypto";
import { redisClient } from "@/config/redis.config";
import { ResetPasswordConstants } from "@/constants/reset";
import { isProduction } from "@/config/env";

// In-memory reset token store for development
const resetTokenStore = new Map<string, { userId: string; expiry: number }>();

export const generateResetToken = async (userId: number): Promise<string> => {
  const token = randomUUID();
  const key = `${ResetPasswordConstants.keyPrefix}${token}`;

  if (redisClient && isProduction) {
    await redisClient.set(
      key,
      userId.toString(),
      "EX",
      ResetPasswordConstants.expirySeconds
    );
  } else {
    // Use in-memory store for development
    const expiry = Date.now() + ResetPasswordConstants.expirySeconds * 1000;
    resetTokenStore.set(token, { userId: userId.toString(), expiry });
  }
  return token;
};

export const getUserIdFromToken = async (token: string) => {
  if (redisClient && isProduction) {
    return redisClient.get(`${ResetPasswordConstants.keyPrefix}${token}`);
  } else {
    // Use in-memory store for development
    const record = resetTokenStore.get(token);
    if (record && Date.now() < record.expiry) {
      return record.userId;
    }
    // Clean up expired token
    resetTokenStore.delete(token);
    return null;
  }
};

export const deleteResetToken = async (token: string) => {
  if (redisClient && isProduction) {
    await redisClient.del(`${ResetPasswordConstants.keyPrefix}${token}`);
  } else {
    resetTokenStore.delete(token);
  }
};
