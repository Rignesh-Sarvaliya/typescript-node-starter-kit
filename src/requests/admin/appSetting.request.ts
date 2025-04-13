import { z } from "zod";

export const GetAppSettingsRequestSchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  sort_by: z.string().optional().default("created_at"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const CreateAppSettingRequestSchema = z.object({
  app_label: z.string().min(2),
  app_type: z.enum(["android", "ios"]),
  app_version: z.number().nonnegative(),
  force_updates: z.boolean(),
  maintenance_mode: z.boolean(),
});

export const UpdateAppSettingRequestSchema = z.object({
  app_label: z.string().min(2),
  app_type: z.enum(["android", "ios"]),
  app_version: z.number().nonnegative(),
  force_updates: z.boolean(),
  maintenance_mode: z.boolean(),
});

export const UpdateAppSettingParamSchema = z.object({
  id: z.string().regex(/^\d+$/), // numeric string
});

export const DeleteAppSettingParamSchema = z.object({
  id: z.string().regex(/^\d+$/),
});
