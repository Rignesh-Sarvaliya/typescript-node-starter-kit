import { UserEntity } from "@/entities/user.entity";

export interface IUserRepository {
    findByEmail(email: string): Promise<UserEntity | null>;
    create(data: { name: string; email: string; password: string }): Promise<UserEntity>;
    findById(id: number): Promise<UserEntity | null>;

}
