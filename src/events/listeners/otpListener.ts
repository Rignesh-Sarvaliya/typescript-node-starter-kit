import { userEmitter } from "@/events/emitters/userEmitter";
import { logger } from "@/utils/logger";

userEmitter.on("otp.sent", ({ email, otp }) => {
  logger.info(`[EVENT] OTP emitted to ${email} -> ${otp}`);
});
