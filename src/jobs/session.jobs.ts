import { logger } from "@/utils/logger";

export const logLogout = (userId: number) => {
  logger.info(`[LOGOUT] User ${userId} logged out`);
};
