import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const updateAppLinkById = async (
  id: number,
  data: { value: string }
) => {
  return prisma.appMenuLink.update({
    where: { id },
    data,
  });
};
