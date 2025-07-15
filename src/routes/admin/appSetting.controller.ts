import { Request, Response, NextFunction } from "express";
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
import { success, error } from "../../utils/responseWrapper";

export const getAppSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = GetAppSettingsRequestSchema.parse(req.query);

    const { data, pagination } = await findAllAppSettings({
      page: parseInt(parsed.page),
      limit: parseInt(parsed.limit),
      sort_by: parsed.sort_by,
      order: parsed.order,
    });

    return res.json(
      success("App settings fetched", {
        settings: formatAppSettingsList(data),
        pagination,
      })
    );
  } catch (err) {
    captureError(err, "getAppSettings");
    return next(err);
  }
};


export const createAppSettingHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = CreateAppSettingRequestSchema.parse(req.body);

    const setting = await createAppSetting(body);

    logAppSettingCreated(body.app_type);

    return res.status(201).json(
      success("App setting created", formatAppSetting(setting))
    );
  } catch (err) {
    captureError(err, "createAppSetting");
    return next(err);
  }
};


export const updateAppSettingHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = UpdateAppSettingParamSchema.parse(req.params);
    const body = UpdateAppSettingRequestSchema.parse(req.body);

    const setting = await updateAppSetting(Number(id), body);

    logAppSettingUpdated(Number(id));

    return res.json(
      success("App setting updated", formatAppSetting(setting))
    );
  } catch (err) {
    captureError(err, "updateAppSetting");
    return next(err);
  }
};


export const deleteAppSettingHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = DeleteAppSettingParamSchema.parse(req.params);

    await softDeleteAppSetting(Number(id));

    logAppSettingDeleted(Number(id));

    return res.json(success("App setting deleted successfully"));
  } catch (err) {
    captureError(err, "deleteAppSetting");
    return next(err);
  }
};
