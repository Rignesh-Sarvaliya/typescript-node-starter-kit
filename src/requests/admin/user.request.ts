import { z } from "zod";

export const UpdateUserParamSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

export const UpdateUserBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  status: z.boolean().optional(),
});

export const ToggleUserParamSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

export const DeleteUserParamSchema = z.object({
  id: z.string().regex(/^\d+$/),
});
