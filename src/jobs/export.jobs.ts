import { logger } from "@/utils/logger";

export const logUserExport = (format: string) => {
  logger.info(`[EXPORT] Exported users as ${format.toUpperCase()}`);
};
