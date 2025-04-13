import { PrismaClient } from "@prisma/client";
import { AdminEntity } from "../domain/entities/admin.entity";
import { AdminEntity } from "../domain/entities/admin.entity";

const prisma = new PrismaClient();

export const findAdminByEmail = async (email: string): Promise<any | null> => {
  return prisma.admin.findUnique({ where: { email } });
};

export const findAdminById = async (id: number): Promise<AdminEntity | null> => {
  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) return null;
  return new AdminEntity(admin.id, admin.name, admin.email);
};