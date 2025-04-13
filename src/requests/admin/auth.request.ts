import { z } from "zod";

export const AdminLoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
