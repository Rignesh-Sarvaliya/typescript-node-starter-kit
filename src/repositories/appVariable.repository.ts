import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAppVariables = async () => {
  return prisma.appVariable.findMany({
    orderBy: { created_at: "desc" },
  });
};
