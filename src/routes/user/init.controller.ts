import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { formatInitAppResponse } from "../../resources/user/init.resource";
import { success, error } from "../../utils/responseWrapper";
import { logger } from "../../utils/logger";
import { asyncHandler } from "../../utils/asyncHandler";

const prisma = new PrismaClient();

export const initApp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { app_type } = req.params;

    const setting = await prisma.appSetting.findFirst({
      where: { app_type },
    });

    if (!setting) {
      return res.status(404).json(error("App settings not found"));
    }

    return res.json(
      success("App settings fetched", formatInitAppResponse(setting))
    );
  }
);
