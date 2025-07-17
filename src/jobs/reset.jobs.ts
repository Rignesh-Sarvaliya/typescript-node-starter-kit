import { logger } from "@/utils/logger";

export const logResetLink = (email: string, url: string) => {
  logger.info(`[RESET] Link sent to ${email}: ${url}`);
};
