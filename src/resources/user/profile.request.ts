import { z } from "zod";

export const UpdateProfileRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});
