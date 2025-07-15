import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createAppVariable = async (data: { name: string; value: string }) => {
  return prisma.appVariable.create({ data });
};

export const updateAppVariable = async (
  id: number,
  data: { name: string; value: string }
) => {
  return prisma.appVariable.update({
    where: { id },
    data,
  });
};
