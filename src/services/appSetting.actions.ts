import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createAppSetting = async (data: {
  app_label: string;
  app_type: string;
  app_version: number;
  force_updates: boolean;
  maintenance_mode: boolean;
}) => {
  return prisma.appSetting.create({ data });
};

export const updateAppSetting = async (
  id: number,
  data: {
    app_label: string;
    app_type: string;
    app_version: number;
    force_updates: boolean;
    maintenance_mode: boolean;
  }
) => {
  return prisma.appSetting.update({
    where: { id },
    data,
  });
};

export const softDeleteAppSetting = async (id: number) => {
  await prisma.appSetting.update({
    where: { id },
    data: { deleted_at: new Date() },
  });
  return true;
};
