import { logger } from "@/utils/logger";

export const logUserUpdated = (id: number) => {
  logger.info(`[USER] Updated user ID ${id}`);
};

export const logUserToggled = (id: number, newStatus: boolean) => {
  logger.info(`[USER] Toggled user ID ${id} → ${newStatus ? "active" : "inactive"}`);
};

export const logUserDeleted = (id: number) => {
  logger.warn(`[USER] Soft-deleted user ID ${id}`);
};
