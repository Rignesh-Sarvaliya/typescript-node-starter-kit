import { Request, Response } from "express";
import { getAppLinks } from "../../repositories/appLink.repository";
import { formatAppLinksList } from "../../resources/admin/appLink.resource";
import { captureError } from "../../telemetry/sentry";

export const getAppLinksHandler = async (req: Request, res: Response) => {
  try {
    const links = await getAppLinks();
    return res.json({ links: formatAppLinksList(links) });
  } catch (error) {
    captureError(error, "getAppLinks");
    return res.fail("Failed to load app links");
  }
};

import {
  UpdateAppLinkBodySchema,
  UpdateAppLinkParamSchema,
} from "../../requests/admin/appLink.request";
import { updateAppLinkById } from "../../repositories/appLink.repository";
import { logAppLinkUpdate } from "../../jobs/appLink.jobs";
import { formatAppLink } from "../../resources/admin/appLink.resource";
import { captureError } from "../../telemetry/sentry";

export const updateAppLinkHandler = async (req: Request, res: Response) => {
  try {
    const { id } = UpdateAppLinkParamSchema.parse(req.params);
    const { value } = UpdateAppLinkBodySchema.parse(req.body);

    const updated = await updateAppLinkById(Number(id), { value });

    logAppLinkUpdate(Number(id));

    return res.json({
      message: "Link updated",
      link: formatAppLink(updated),
    });
  } catch (error) {
    captureError(error, "updateAppLink");
    return res.fail("Failed to update app link");
  }
};
