import { logger } from "../utils/logger";

export const logAppleCheck = (socialId: string) => {
  logger.info(`[APPLE CHECK] social_id: ${socialId}`);
};
