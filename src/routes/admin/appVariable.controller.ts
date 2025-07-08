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
import { success, error } from "../../utils/responseWrapper";



export const getAppVariablesHandler = async (req: Request, res: Response) => {
  try {
    const vars = await getAppVariables();
    return res.json(success("Variables fetched", formatAppVariableList(vars)));
  } catch (err) {
    captureError(err, "getAppVariables");
    return res.status(500).json(error("Failed to load app variables"));
  }
};

export const createAppVariableHandler = async (req: Request, res: Response) => {
  try {
    const body = CreateAppVariableSchema.parse(req.body);

    const variable = await createAppVariable(body);
    logAppVariableCreated(body.name);

    return res.status(201).json(
      success("App variable created", formatAppVariable(variable))
    );
  } catch (err) {
    captureError(err, "createAppVariable");
    return res.status(500).json(error("Failed to create app variable"));
  }
};

export const updateAppVariableHandler = async (req: Request, res: Response) => {
  try {
    const { id } = UpdateAppVariableParamSchema.parse(req.params);
    const body = UpdateAppVariableBodySchema.parse(req.body);

    const updated = await updateAppVariable(Number(id), body);
    logAppVariableUpdated(Number(id));

    return res.json(
      success("App variable updated", formatAppVariable(updated))
    );
  } catch (err) {
    captureError(err, "updateAppVariable");
    return res.status(500).json(error("Failed to update app variable"));
  }
};
