import { logger } from "@/utils/logger";

export const logAppVariableCreated = (name: string) => {
  logger.info(`[APP_VARIABLE] Created variable: ${name}`);
};

export const logAppVariableUpdated = (id: number) => {
  logger.info(`[APP_VARIABLE] Updated ID ${id}`);
};
