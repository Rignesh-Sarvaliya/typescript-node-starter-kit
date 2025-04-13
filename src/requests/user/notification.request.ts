import { z } from "zod";

export const NotificationStatusParamSchema = z.object({
  status: z.enum(["read", "unread"]),
});
