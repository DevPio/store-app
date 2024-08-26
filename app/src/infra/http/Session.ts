import session from 'express-session'
import pgSession from 'connect-pg-simple'
import { db } from '../database/db'



const dbSession = pgSession(session)

export default session({
    store: new dbSession({
        pool: db
    }),
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
    }
})