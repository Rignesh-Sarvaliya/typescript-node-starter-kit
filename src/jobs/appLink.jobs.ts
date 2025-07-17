import { logger } from "@/utils/logger";

export const logAppLinkUpdate = (id: number) => {
  logger.info(`[APP_LINK] Updated link ID ${id}`);
};
