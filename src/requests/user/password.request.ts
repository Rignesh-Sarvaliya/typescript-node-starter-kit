import { z } from "zod";

export const ChangePasswordRequestSchema = z.object({
  current_password: z.string().min(6),
  new_password: z.string().min(6),
});

export const ResetPasswordBodySchema = z.object({
  new_password: z.string().min(6),
});

export const ResetPasswordParamsSchema = z.object({
  token: z.string().uuid(),
});
