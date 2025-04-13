import { logger } from "../utils/logger";

export const logRegistration = (email: string) => {
  logger.info(`[REGISTER] ${email} registered`);
};

export const logLogin = (email: string) => {
  logger.info(`[LOGIN] ${email} logged in`);
};
