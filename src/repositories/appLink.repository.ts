import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAppLinks = async () => {
  return prisma.appMenuLink.findMany({
    orderBy: { created_at: "desc" },
  });
};
