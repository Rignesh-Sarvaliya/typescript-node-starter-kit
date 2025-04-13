import { logger } from "../utils/logger";

export const logPasswordChange = (userId: number) => {
  logger.info(`[PASSWORD] User ${userId} changed password`);
};
