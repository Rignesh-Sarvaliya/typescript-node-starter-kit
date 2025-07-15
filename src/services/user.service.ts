import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createUser = async (data: { name: string; email: string; password: string }) => {
  return prisma.user.create({ data });
};

export const updateUserById = async (
  id: number,
  data: { name?: string; email?: string; status?: boolean }
) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const toggleUserStatus = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");
  return prisma.user.update({
    where: { id },
    data: { status: !user.status },
  });
};

export const softDeleteUser = async (id: number) => {
  return prisma.user.update({
    where: { id },
    data: { deleted_at: new Date() },
  });
};

export const changeUserPassword = async (userId: number, newPassword: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { password: newPassword },
  });
};
