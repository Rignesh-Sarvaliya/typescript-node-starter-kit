import { Request, Response } from "express";
import { GetAppSettingsRequestSchema } from "../../requests/admin/appSetting.request";
import { findAllAppSettings } from "../../repositories/appSetting.repository";
import { formatAppSettingsList } from "../../resources/admin/appSetting.resource";
import { captureError } from "../../telemetry/sentry";
import { CreateAppSettingRequestSchema } from "../../requests/admin/appSetting.request";
import { createAppSetting } from "../../repositories/appSetting.repository";
import { formatAppSetting } from "../../resources/admin/appSetting.resource";
import { logAppSettingCreated } from "../../jobs/appSetting.jobs";
import {
  UpdateAppSettingRequestSchema,
  UpdateAppSettingParamSchema,
} from "../../requests/admin/appSetting.request";
import { updateAppSetting } from "../../repositories/appSetting.repository";
import { logAppSettingUpdated } from "../../jobs/appSetting.jobs";
import { DeleteAppSettingParamSchema } from "../../requests/admin/appSetting.request";
import { softDeleteAppSetting } from "../../repositories/appSetting.repository";
import { logAppSettingDeleted } from "../../jobs/appSetting.jobs";

export const getAppSettings = async (req: Request, res: Response) => {
  try {
    const parsed = GetAppSettingsRequestSchema.parse(req.query);

    const { data, pagination } = await findAllAppSettings({
      page: parseInt(parsed.page),
      limit: parseInt(parsed.limit),
      sort_by: parsed.sort_by,
      order: parsed.order,
    });

    return res.json({
      settings: formatAppSettingsList(data),
      pagination,
    });
  } catch (error) {
    captureError(error, "getAppSettings");
    return res.fail("Failed to fetch app settings");
  }
};


export const createAppSettingHandler = async (req: Request, res: Response) => {
  try {
    const body = CreateAppSettingRequestSchema.parse(req.body);

    const setting = await createAppSetting(body);

    logAppSettingCreated(body.app_type);

    return res.status(201).json({
      message: "App setting created",
      setting: formatAppSetting(setting),
    });
  } catch (error) {
    captureError(error, "createAppSetting");
    return res.fail("Failed to create app setting");
  }
};


export const updateAppSettingHandler = async (req: Request, res: Response) => {
  try {
    const { id } = UpdateAppSettingParamSchema.parse(req.params);
    const body = UpdateAppSettingRequestSchema.parse(req.body);

    const setting = await updateAppSetting(Number(id), body);

    logAppSettingUpdated(Number(id));

    return res.json({
      message: "App setting updated",
      setting: formatAppSetting(setting),
    });
  } catch (error) {
    captureError(error, "updateAppSetting");
    return res.fail("Failed to update app setting");
  }
};


export const deleteAppSettingHandler = async (req: Request, res: Response) => {
  try {
    const { id } = DeleteAppSettingParamSchema.parse(req.params);

    await softDeleteAppSetting(Number(id));

    logAppSettingDeleted(Number(id));

    return res.json({ message: "App setting deleted successfully" });
  } catch (error) {
    captureError(error, "deleteAppSetting");
    return res.fail("Failed to delete app setting");
  }
};
