import { logger } from "../utils/logger";

export const logAdminLogin = (adminId: number, email: string) => {
  logger.info(`[ADMIN LOGIN] ${adminId} - ${email}`);
};
