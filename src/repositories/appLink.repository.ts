import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAppLinks = async () => {
  return prisma.appMenuLink.findMany({
    orderBy: { created_at: "desc" },
  });
};

export const updateAppLinkById = async (
  id: number,
  data: { value: string }
) => {
  return prisma.appMenuLink.update({
    where: { id },
    data,
  });
};
