import express, { Request, Response } from 'express'
import methodOverride from 'method-override'
import fileUpload from 'express-fileupload'
import nunjucks from 'nunjucks'
export type HttpMethod = 'get' | 'post' | 'head' | 'put' | 'delete' | 'connect' | 'options' | 'trace' | 'patch';

export interface Http {
    route(method: HttpMethod, url: string, callback: Function, template: string, redirect?: boolean): void;
    listen(port: number, callback?: () => void): void;
}

export class ExpressAdapter implements Http {
    app?: any
    constructor() {
        this.app = express()
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(express.static('public'))
        this.app.use(methodOverride('_method'))
        this.app.use(fileUpload())
        this.app.set('view engine', 'njk')
        nunjucks.configure('src/views', {
            express: this.app,
            autoescape: false,
            noCache: true
        })
    }
    route(method: HttpMethod, url: string, callback: Function, template: string, redirect?: boolean): void {
        this.app[method](url, async (req: Request, res: Response) => {

            const output = await callback(req.params, req.body, req.files, req.query);


            if (redirect) {
                return res['redirect'](output.url_redirect)
            }

            if (output) {
                return res['render'](template, { ...output });
            }

            return res['render'](template);

        });
    }
    listen(port: number, callback?: () => void) {

        if (typeof callback === 'function') return this.app?.listen(port, callback)

        return this.app.listen(port)
    }

}