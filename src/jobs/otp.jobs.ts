import { logger } from "../utils/logger";

export const logOtpSend = (email: string, otp: string) => {
  logger.info(`[OTP] Sent to ${email}: ${otp}`);
};
