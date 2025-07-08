import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { formatInitAppResponse } from "../../resources/user/init.resource";
import { success, error } from "../../utils/responseWrapper";

const prisma = new PrismaClient();

export const initApp = async (req: Request, res: Response) => {
  const { app_type } = req.params;

  try {
    const setting = await prisma.appSetting.findFirst({
      where: { app_type },
    });

    if (!setting) {
      return res.status(404).json(error("App settings not found"));
    }

    return res.json(success("App settings fetched", formatInitAppResponse(setting)));
  } catch (err) {
    console.error("InitApp Error:", err);
    return res.status(500).json(error("Server error"));
  }
};
