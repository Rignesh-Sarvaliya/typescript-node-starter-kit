import { PrismaClient } from "@prisma/client";
import { UserEntity } from "../domain/entities/user.entity";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id: number): Promise<UserEntity | null> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;
  return new UserEntity(user.id, user.name, user.email);
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
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

export const changeUserPassword = async (
  userId: number,
  newPassword: string
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { password: newPassword },
  });
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: { created_at: "desc" },
  });
};

export const toggleUserStatus = async (id: number): Promise<any> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");

  return prisma.user.update({
    where: { id },
    data: { status: !user.status },
  });
};

export const softDeleteUser = async (id: number): Promise<any> => {
  return prisma.user.update({
    where: { id },
    data: { deleted_at: new Date() },
  });
};

export const getAllUsersForExport = async () => {
  return prisma.user.findMany({
    where: { deleted_at: null },
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      created_at: true,
    },
  });
};

export const findUserWithPasswordById = async (id: number) => {
  return prisma.user.findUnique({ where: { id } });
};
