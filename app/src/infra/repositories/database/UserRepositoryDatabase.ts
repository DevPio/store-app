import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { UserOutPut } from "../../../services/types";
import { db } from "../../database/db";


export class UserRepositoryDatabase implements UserRepository {
    async getAll(): Promise<User[]> {
        const usersOut = await db.query<UserOutPut>(`
            SELECT * FROM users
            `)

        return usersOut.rows.map(userOut => {
            const user = new User(
                userOut.id,
                userOut.name,
                userOut.email,
                userOut.password,
                userOut.cpf_cnpj,
                userOut.cep,
                userOut.address
            )


            return user
        })
    }
    async get(email: string): Promise<User | undefined> {
        const getUser = await db.query<UserOutPut>(`
            SELECT * FROM users
            WHERE email = $1
            `,
            [
                email
            ]
        )

        const userOut = getUser.rows[0]

        if (!userOut) return
        const user = new User(
            userOut.id,
            userOut.name,
            userOut.email,
            userOut.password,
            userOut.cpf_cnpj,
            userOut.cep,
            userOut.address
        )
        return user
    }

    async getById(id: number): Promise<User | undefined> {
        const getUser = await db.query<UserOutPut>(`
            SELECT * FROM users
            WHERE id = $1
            `,
            [
                id
            ]
        )

        const userOut = getUser.rows[0]

        const user = new User(
            userOut.id,
            userOut.name,
            userOut.email,
            userOut.password,
            userOut.cpf_cnpj,
            userOut.cep,
            userOut.address
        )
        return user
    }
    async save(user: User): Promise<User> {
        const userInsert = await db.query<UserOutPut>(`
            INSERT INTO users
            (
                name,
                email,
                password,
                cpf_cnpj,
                cep,
                address
            )
            VALUES
            (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
            )
            RETURNING *
            `,
            [
                user.name,
                user.email,
                user.password,
                user.cpfCnpj,
                user.cep,
                user.address
            ]
        )

        const userOut = userInsert.rows[0]
        const newInstanceUser = new User(
            userOut.id,
            userOut.name,
            userOut.email,
            userOut.password,
            userOut.cpf_cnpj,
            userOut.cep,
            userOut.address
        )
        return newInstanceUser
    }
    async update(user: User): Promise<User> {
        let query = `
        UPDATE users
            SET name = $1, email = $2, password = $3, cpf_cnpj = $4, cep = $5, address = $6
            WHERE id = $7 
        RETURNING *
        
        
        `
        let values = [
            user.name,
            user.email,
            user.password,
            user.cpfCnpj,
            user.cep,
            user.address,
            user.id
        ]
        if (!user.password) {
            query = `
            UPDATE users
                SET name = $1, email = $2, cpf_cnpj = $3, cep = $4, address = $5
                WHERE id = $6 
            RETURNING *
            `
            values = [
                user.name,
                user.email,
                user.cpfCnpj,
                user.cep,
                user.address,
                user.id
            ]

        }
        const updateUser = await db.query<UserOutPut>(query,
            values
        )

        const userOut = updateUser.rows[0]

        const newInstanceUser = new User(
            userOut.id,
            userOut.name,
            userOut.email,
            userOut.password,
            userOut.cpf_cnpj,
            userOut.cep,
            userOut.address
        )

        return newInstanceUser
    }
    async delete(email: string): Promise<void> {
        await db.query(`
            DELETE FROM users
            WHERE email = $1
            `, [
            email
        ])
    }

}