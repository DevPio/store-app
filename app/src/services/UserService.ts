import { User } from "../domain/entities/User";
import { UserRepository } from "../domain/repositories/UserRepository";
import { BcryptHash } from "../infra/adapters/ByCriptHash";
import { UserInput } from "./types";


export class UserService {
    constructor(private userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async deleteUser(email: string) {
        return await this.userRepository.delete(email)
    }

    async getUserByEmail(email: string) {
        return await this.userRepository.get(email)
    }

    async updateUser(user: UserInput) {
        let password = user.password;
        const bcrypt = new BcryptHash()
        if (password) {
            password = await bcrypt.hash(password)
        }
        const newUser = new User(
            parseInt(user.id as string),
            user.name,
            user.email,
            password,
            parseInt(user.cpf_cnpj.replace(/\D/g, '')),
            user.cep.replace(/\D/g, ''),
            user.fullAddress
        )
        return await this.userRepository.update(newUser);
    }
    async getUserById(id: number) {
        return await this.userRepository.getById(id)
    }
    async saveUser(user: UserInput) {
        const bcrypt = new BcryptHash()
        const newUser = new User(
            0,
            user.name,
            user.email,
            await bcrypt.hash(user.password),
            parseInt(user.cpf_cnpj.replace(/\D/g, '')),
            user.cep.replace(/\D/g, ''),
            user.fullAddress
        )
        return await this.userRepository.save(newUser);
    }


    async setToken(userId: number, token: string, token_expires: Date) {
        await this.userRepository.setToken(userId, token, token_expires)
    }
}