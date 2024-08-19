import { NextFunction, Request, Response } from "express";

export const redirectLogin = (req: Request, res: Response, next: NextFunction) => {


    //@ts-ignore
    if (!req.session.user) {
        return res.redirect('/login')
    }

    return next()
}