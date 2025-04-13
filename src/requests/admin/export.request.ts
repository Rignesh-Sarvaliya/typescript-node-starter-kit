import { z } from "zod";

export const ExportUserParamSchema = z.object({
  type: z.enum(["csv", "xlsx"]),
});
