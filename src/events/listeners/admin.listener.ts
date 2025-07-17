import { appEmitter, APP_EVENTS } from "@/events/emitters/appEmitter";
import { logger } from "@/utils/logger";

appEmitter.on(APP_EVENTS.ADMIN_LOGGED_IN, (payload) => {
  logger.info("🔐 Admin logged in:", payload.email);
  // Track login time, security log, etc.
});
