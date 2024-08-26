import { UserInput } from "../../services/types";
import { UserService } from "../../services/UserService";
import { BcryptHash } from "../adapters/ByCriptHash";
import { Http } from "../http/ExpressAdapter";

export class UserController {

    constructor(
        http: Http,
        userService: UserService
    ) {
        this.addStoreRender(http, userService)
    }


    addStoreRender(http: Http, userService: UserService) {
        http.route('get', '/users', async (params: any, body: any) => {
            return {};
        }, 'user/register.njk')


        http.route('get', '/users/:userId', async (params: any, body: any, files: any, query: any, session: any) => {

            const user = await userService.getUserById(params.userId)

            if (!user) {
                return {
                    error: {
                        message: "Usuário não encontrado"
                    }
                }
            }

            if (session.error) {
                const currentError = session.error
                delete session.error
                return { user, update: true, error: currentError };
            }

            if (session.success) {
                const success = session.success

                delete session.success

                return { user, update: true, success };
            }

            return { user, update: true };
        }, 'user/register.njk')


        http.route('post', '/users', async (params: any, body: UserInput) => {

            const keys = Object.keys(body)

            for (const key of keys) {
                //@ts-ignore
                if (!body[key]) return {
                    user: body,
                    error: {
                        message: `Preencha o campo ${key}`
                    }
                }
            }

            const findUser = await userService.getUserByEmail(body.email)

            if (findUser) {
                return {
                    error: {
                        message: "Email já utilizado."
                    }
                }
            }


            const user = await userService.saveUser(body)

            return { url_redirect: `/users/${user.id}` };
        }, 'user/register.njk', true)


        http.route('put', '/users', async (params: any, body: UserInput, files: any, query: any, session: any) => {

            if (!body.password) {
                session.error = {
                    message: "Por favor preencha a senha para atualizar seu cadastro."
                }
                return {
                    user: body,
                    url_redirect: `/users/${body.id}`
                }
            }


            const getUser = await userService.getUserById(parseInt(body.id as string))


            const bcrypt = new BcryptHash()

            const passwordEqual = await bcrypt.compare(body.password, getUser?.password as string)

            if (!passwordEqual) {
                session.error = {
                    message: "Senha incorreta!"
                }
                return {
                    user: body,
                    url_redirect: `/users/${body.id}`
                }
            }

            const user = await userService.updateUser(body)

            session.success = {
                message: "Usuário atualizado com sucesso!"
            }
            return { url_redirect: `/users/${user.id}` };
        }, 'user/register.njk', true)



        http.route('delete', '/users', async (params: any, body: UserInput) => {

            await userService.deleteUser(body.email)

            return { url_redirect: `/users` };
        }, 'user/register.njk', true)
    }
}