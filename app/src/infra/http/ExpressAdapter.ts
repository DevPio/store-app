import express, { NextFunction, Request, Response } from 'express'
import methodOverride from 'method-override'
import fileUpload from 'express-fileupload'
import nunjucks from 'nunjucks'
import session from './Session'
import { Cart, countTotal } from '../../domain/entities/Cart'


export type HttpMethod = 'get' | 'post' | 'head' | 'put' | 'delete' | 'connect' | 'options' | 'trace' | 'patch';

export interface Http {
    route(method: HttpMethod, url: string, callback: Function, template: string, redirect?: boolean, middleware?: Function): void;
    listen(port: number, callback?: () => void): void;
}



const defaultRoute = (req: Request, res: Response, next: NextFunction) => next()

export class ExpressAdapter implements Http {
    app?: any
    constructor() {
        this.app = express()
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.static('public'))
        this.app.use(methodOverride('_method'))
        this.app.use(fileUpload())
        this.app.use(session)
        this.app.set('view engine', 'njk')
        nunjucks.configure('src/views', {
            express: this.app,
            autoescape: false,
            noCache: true
        })
    }
    route(method: HttpMethod, url: string, callback: Function, template: string, redirect?: boolean, middleware = defaultRoute): void {
        this.app[method](url, middleware, async (req: Request, res: Response) => {


            const output = await callback(req.params, req.body, req.files, req.query, req.session);

            //@ts-ignore
            if (req.session && !req.session.cart) {
                //@ts-ignore
                req.session.cart = new Cart()
            }

            //@ts-ignore
            const cart = req.session.cart as Cart

            if (output && output.error && redirect) {
                return res['redirect'](output.url_redirect)
            }
            if (output && (output.error || output.animationError)) {
                //@ts-ignore
                return res['render'](template, { ...output, user: req.session ? req.session.user : null, totalItems: countTotal(cart) });
            }

            if (redirect) {
                return res['redirect'](output.url_redirect)
            }

            if (output) {
                //@ts-ignore
                return res['render'](template, { ...output, user: req.session ? req.session.user : null, totalItems: countTotal(cart) });
            }

            return res['render'](template);

        });
    }

    listen(port: number, callback?: () => void) {

        if (typeof callback === 'function') return this.app?.listen(port, callback)

        return this.app.listen(port)
    }

}