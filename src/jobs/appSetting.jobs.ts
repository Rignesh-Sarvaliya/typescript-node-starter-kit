import { logger } from "../utils/logger";

export const logAppSettingCreated = (type: string) => {
  logger.info(`[APP_SETTING] New setting created for ${type}`);
};

export const logAppSettingUpdated = (id: number) => {
  logger.info(`[APP_SETTING] Updated setting ID ${id}`);
};

export const logAppSettingDeleted = (id: number) => {
  logger.warn(`[APP_SETTING] Soft-deleted setting ID ${id}`);
};
