import { User } from "../entities/User";

export interface UserRepository {
    getAll(): Promise<User[]>;
    get(email: string): Promise<User | undefined>;
    getById(id: number): Promise<User | undefined>;
    save(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(email: string): Promise<void>;
    setToken(userId: number, token: string, token_expires: Date): Promise<void>
}