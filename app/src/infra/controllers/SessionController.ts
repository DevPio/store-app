import { UserInput } from "../../services/types";
import { UserService } from "../../services/UserService";
import { BcryptHash } from "../adapters/ByCriptHash";
import { Http } from "../http/ExpressAdapter";
import crypto from "crypto"


export class SessionController {
    constructor(http: Http, userService: UserService) {
        this.addStoreRender(http, userService)
    }


    addStoreRender(http: Http, userService: UserService) {
        http.route('get', '/login', async (params: any, body: UserInput, files: any, query: any, session: any) => {

            if (session.error) {
                const currentError = session.error
                delete session.error
                return { error: currentError };
            }

            return {};
        }, 'session/index.njk')


        http.route('get', '/logout', async (params: any, body: UserInput, files: any, query: any, session: any) => {

            if (session.error) {
                const currentError = session.error
                delete session.error
                return { error: currentError };
            }

            session.destroy()

            return { url_redirect: `/` };
        }, 'session/index.njk')


        http.route('post', '/login', async (params: any, body: UserInput, files: any, query: any, session: any) => {

            const keys = Object.keys(body)

            for (const key of keys) {

                //@ts-ignore
                if (!body[key]) {
                    session.error = {
                        message: "Por favor preencha todos os campos!"
                    }
                    return {
                        user: body,
                        url_redirect: `/login`
                    }
                }
            }

            const getUser = await userService.getUserByEmail(body.email)

            if (!getUser) {
                session.error = {
                    message: "Usuário não encontrado, por favor crie uma conta!"
                }
                return {
                    user: body,
                    url_redirect: `/login`
                }
            }


            const bcrypt = new BcryptHash()


            const equal = await bcrypt.compare(body.password, getUser.password)

            if (!equal) {
                session.error = {
                    message: "Senha incorreta!"
                }
                return {
                    user: body,
                    url_redirect: `/login`
                }
            }

            session.user = getUser
            return { url_redirect: `/` };
        }, 'session/index.njk', true)

        http.route('post', '/forgot-password', async (params: any, body: UserInput, files: any, query: any, session: any) => {

            const keys = Object.keys(body)

            for (const key of keys) {

                //@ts-ignore
                if (!body[key]) {
                    session.error = {
                        message: "Por favor preencha todos os campos!"
                    }
                    return {
                        user: body,
                        url_redirect: `/forgot-password`
                    }
                }
            }

            const getUser = await userService.getUserByEmail(body.email)

            if (!getUser) {
                session.error = {
                    message: "Email não cadastrado!"
                }
                return {
                    user: body,
                    url_redirect: `/forgot-password`
                }
            }

            const token = crypto.randomBytes(20).toString('hex')

            const now = new Date()

            now.setMinutes(now.getMinutes() + 10)


            await userService.setToken(getUser.id, token, now)

            session.success = {
                message: "Um email de reset de senha foi enviado para você!"
            }

            return {
                user: body,
                url_redirect: `/forgot-password`
            }
        }, 'session/forgot-password.njk', true)

        http.route('get', '/forgot-password', async (params: any, body: UserInput, files: any, query: any, session: any) => {

            if (session.error) {
                const currentError = session.error
                delete session.error
                return { error: currentError };
            }

            if (session.success) {
                const success = session.success

                delete session.success

                return { success };
            }

            return {};
        }, 'session/forgot-password.njk')
    }
}