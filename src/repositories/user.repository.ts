import { PrismaClient } from "@prisma/client";
import { UserEntity } from "@/domain/entities/user.entity";

const prisma = new PrismaClient();

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id: number): Promise<UserEntity | null> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;
  return new UserEntity(user.id, user.name, user.email);
};


export const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: { created_at: "desc" },
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
