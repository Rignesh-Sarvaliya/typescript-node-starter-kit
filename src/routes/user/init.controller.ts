import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { formatInitAppResponse } from "../../resources/user/init.resource";

const prisma = new PrismaClient();

export const initApp = async (req: Request, res: Response) => {
  const { app_type } = req.params;

  try {
    const setting = await prisma.appSetting.findFirst({
      where: { app_type },
    });

    if (!setting) {
      return res.status(404).json({ message: "App settings not found" });
    }

    return res.json(formatInitAppResponse(setting));
  } catch (error) {
    console.error("InitApp Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
