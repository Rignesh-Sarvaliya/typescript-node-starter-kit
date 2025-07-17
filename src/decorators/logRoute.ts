import { logger } from "@/utils/logger";

export const logRoute = (routeName: string) => {
  return function (req: any, res: any, next: () => void) {
    logger.info(`[${routeName}] Hit at: ${new Date().toISOString()}`);
    next();
  };
};
