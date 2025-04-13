import { AdminEntity } from "../../domain/entities/admin.entity";

export const formatAdminResponse = (admin: AdminEntity) => ({
  id: admin.id,
  name: admin.name,
  email: admin.email,
});
