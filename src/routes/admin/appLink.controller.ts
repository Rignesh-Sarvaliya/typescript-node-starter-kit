import { Request, Response, NextFunction } from "express";
import { getAppLinks } from "../../repositories/appLink.repository";
import { formatAppLinksList } from "../../resources/admin/appLink.resource";
import { captureError } from "../../telemetry/sentry";
import { success, error } from "../../utils/responseWrapper";

export const getAppLinksHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const links = await getAppLinks();
    return res.json(success("Links fetched", formatAppLinksList(links)));
  } catch (err) {
    captureError(err, "getAppLinks");
    return next(err);
  }
};

import {
  UpdateAppLinkBodySchema,
  UpdateAppLinkParamSchema,
} from "../../requests/admin/appLink.request";
import { updateAppLinkById } from "../../repositories/appLink.repository";
import { logAppLinkUpdate } from "../../jobs/appLink.jobs";
import { formatAppLink } from "../../resources/admin/appLink.resource";

export const updateAppLinkHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = UpdateAppLinkParamSchema.parse(req.params);
    const { value } = UpdateAppLinkBodySchema.parse(req.body);

    const updated = await updateAppLinkById(Number(id), { value });

    logAppLinkUpdate(Number(id));

    return res.json(
      success("Link updated", formatAppLink(updated))
    );
  } catch (err) {
    captureError(err, "updateAppLink");
    return next(err);
  }
};
