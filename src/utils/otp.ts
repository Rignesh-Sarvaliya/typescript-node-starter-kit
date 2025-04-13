import { redisClient } from "../config/redis.config";
import { OtpConstants } from "../constants/otp";

export const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const saveOtpToRedis = async (email: string, otp: string) => {
  const key = `${OtpConstants.keyPrefix}${email}`;
  await redisClient.set(key, otp, "EX", OtpConstants.expirySeconds);
};

export const getOtpFromRedis = async (email: string) => {
  return redisClient.get(`${OtpConstants.keyPrefix}${email}`);
};
