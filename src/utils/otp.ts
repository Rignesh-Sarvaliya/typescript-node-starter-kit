import { redisClient } from "../config/redis.config";
import { OtpConstants } from "../constants/otp";
import { isProduction } from "../config/env";

// In-memory OTP store for development
const otpStore = new Map<string, { otp: string; expiry: number }>();

export const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const saveOtpToRedis = async (email: string, otp: string) => {
  const key = `${OtpConstants.keyPrefix}${email}`;

  if (redisClient && isProduction) {
    await redisClient.set(key, otp, "EX", OtpConstants.expirySeconds);
  } else {
    // Use in-memory store for development
    const expiry = Date.now() + OtpConstants.expirySeconds * 1000;
    otpStore.set(email, { otp, expiry });
  }
};

export const getOtpFromRedis = async (email: string) => {
  if (redisClient && isProduction) {
    return redisClient.get(`${OtpConstants.keyPrefix}${email}`);
  } else {
    // Use in-memory store for development
    const record = otpStore.get(email);
    if (record && Date.now() < record.expiry) {
      return record.otp;
    }
    // Clean up expired OTP
    otpStore.delete(email);
    return null;
  }
};
