import { z } from "zod";

export const CreateAppVariableSchema = z.object({
  name: z.string().min(2),
  value: z.string().min(1),
});

export const UpdateAppVariableParamSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

export const UpdateAppVariableBodySchema = z.object({
  name: z.string().min(2),
  value: z.string().min(1),
});
