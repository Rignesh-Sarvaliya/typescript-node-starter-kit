import { Request, Response } from "express";
import { getAppVariables } from "../../repositories/appVariable.repository";
import { formatAppVariableList } from "../../resources/admin/appVariable.resource";
import { captureError } from "../../telemetry/sentry";
import { CreateAppVariableSchema } from "../../requests/admin/appVariable.request";
import { createAppVariable } from "../../repositories/appVariable.repository";
import { logAppVariableCreated } from "../../jobs/appVariable.jobs";
import { formatAppVariable } from "../../resources/admin/appVariable.resource";
import {
  UpdateAppVariableParamSchema,
  UpdateAppVariableBodySchema,
} from "../../requests/admin/appVariable.request";
import { updateAppVariable } from "../../repositories/appVariable.repository";
import { logAppVariableUpdated } from "../../jobs/appVariable.jobs";



export const getAppVariablesHandler = async (req: Request, res: Response) => {
  try {
    const vars = await getAppVariables();
    return res.json({ variables: formatAppVariableList(vars) });
  } catch (error) {
    captureError(error, "getAppVariables");
    return res.fail("Failed to load app variables");
  }
};

export const createAppVariableHandler = async (req: Request, res: Response) => {
  try {
    const body = CreateAppVariableSchema.parse(req.body);

    const variable = await createAppVariable(body);
    logAppVariableCreated(body.name);

    return res.status(201).json({
      message: "App variable created",
      variable: formatAppVariable(variable),
    });
  } catch (error) {
    captureError(error, "createAppVariable");
    return res.fail("Failed to create app variable");
  }
};

export const updateAppVariableHandler = async (req: Request, res: Response) => {
  try {
    const { id } = UpdateAppVariableParamSchema.parse(req.params);
    const body = UpdateAppVariableBodySchema.parse(req.body);

    const updated = await updateAppVariable(Number(id), body);
    logAppVariableUpdated(Number(id));

    return res.json({
      message: "App variable updated",
      variable: formatAppVariable(updated),
    });
  } catch (error) {
    captureError(error, "updateAppVariable");
    return res.fail("Failed to update app variable");
  }
};
