import { UserEntity } from "../../domain/entities/user.entity";

export const formatUserResponse = (user: UserEntity) => ({
  id: user.id,
  name: user.displayName,
  email: user.email,
});
