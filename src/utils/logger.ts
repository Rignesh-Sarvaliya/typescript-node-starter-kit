import { isProduction } from "@/config/env";

export const logger = {
  info: (...args: any[]) => {
    if (!isProduction) console.log("[INFO]", ...args);
  },
  warn: (...args: any[]) => console.warn("[WARN]", ...args),
  error: (...args: any[]) => console.error("[ERROR]", ...args),
};
