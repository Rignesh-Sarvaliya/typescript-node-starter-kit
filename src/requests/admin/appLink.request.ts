import { z } from "zod";

export const UpdateAppLinkParamSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

export const UpdateAppLinkBodySchema = z.object({
  value: z.string().min(1), // CKEditor or plain HTML
});
