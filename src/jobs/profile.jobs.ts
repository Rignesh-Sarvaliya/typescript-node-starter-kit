import { logger } from "@/utils/logger";

export const logUserUpdate = (id: number, email: string) => {
  logger.info(`[USER UPDATE] ${id} → ${email}`);
};
