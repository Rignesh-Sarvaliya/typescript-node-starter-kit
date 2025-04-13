import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const findAllAppSettings = async ({
  page,
  limit,
  sort_by,
  order,
}: {
  page: number;
  limit: number;
  sort_by: string;
  order: "asc" | "desc";
}) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.appSetting.findMany({
      skip,
      take: limit,
      orderBy: { [sort_by]: order },
    }),
    prisma.appSetting.count(),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit),
    },
  };
};

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

export const softDeleteAppSetting = async (id: number): Promise<boolean> => {
  await prisma.appSetting.update({
    where: { id },
    data: { deleted_at: new Date() },
  });

  return true;
};
