import { z } from "zod";

export const InitAppRequestSchema = z.object({
  app_version: z.string().regex(/^\d+(\.\d+)*$/, "Invalid version format"),
  app_type: z.enum(["android", "ios"]),
});
