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

export const findAppSettingByType = async (app_type: string) => {
  return prisma.appSetting.findFirst({
    where: { app_type },
  });
};
