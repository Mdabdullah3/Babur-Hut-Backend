import type { Express } from 'express'
import path from 'node:path'
import crypto from 'node:crypto'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'
import MongoStore from 'connect-mongo'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'
// import csurf from 'csurf'

import routers from './routes'
import * as errorController from './controllers/errorController'
import { passportConfig } from './controllers/passportConfig'
import { dbConnect } from './models/dbConnect'


dbConnect() 		// also add dotenv.config()
errorController.exceptionErrorHandler() // put it very top


const { SESSION_SECRET,  MONGO_HOST, NODE_ENV } = process.env || {}
// const { SESSION_SECRET,  MONGO_HOST } = process.env || {}
const publicDirectory = path.join(process.cwd(), 'public')

// MONGO_HOST required into session({ store })
const DATABASE_URL = `mongodb://${MONGO_HOST}/babur-hat`
if(!MONGO_HOST) throw new Error(`Error => MONGO_HOST: ${MONGO_HOST}`)
if(!SESSION_SECRET) throw new Error(`Error: => SESSION_SECRET=${SESSION_SECRET}`)


const app: Express = express()

// app.use(helmet()) 		// adds security headers
app.use(helmet({
	contentSecurityPolicy: false,  				// Disable CSP if it's interfering
	noSniff: false,  											// Disable X-Content-Type-Options header
}));
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", "'baburhaatbd.com'"],
//     },
//   })
// )


app.use(mongoSanitize()) 												// prevent mongodb injection attach

const limit = 400
const message = `you API sending too many request, limit: ${limit}`
app.use(rateLimit({ 														// 
	limit,
	windowMs: 1000 * 60 * 60, 										// window == request /ms
	handler: (_req, _res, next) => next(errorController.appError(message, 400, 'LimitError'))
})) 	


app.use(hpp()) 																	// prevent HTML paramiter polution

// // require to send csurf token to access from frontend
// app.use( csurf({ cookie: true })) 							// prevent Cross-Site Request Forgery attacks



// List of allowed origins
const allowedOrigins = [
	'https://baburhaatbd.com',
	'http://baburhaatbd.com',

	'https://baburhaatbd.com:5000',
	'http://baburhaatbd.com:5000',

	'https://baburhaatbd.com:3000',
	'https://baburhaatbd.com:3001',
	'https://baburhaatbd.com:3002',
	'http://baburhaatbd.com:3000',
	'http://baburhaatbd.com:3001',
	'http://baburhaatbd.com:3002',

	'https://103.148.15.24:5000', 
	'http://103.148.15.24:5000', 

	'https://103.148.15.24:3000', 
	'http://103.148.15.24:3000', 
	'http://103.148.15.24:3001', 
	'http://103.148.15.24:3002', 

	'http://localhost:5000', 
	'http://localhost:3000', 
	'http://localhost:3001', 
	'http://localhost:3002', 
]

// CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'Riaz: The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
};
app.use(cors(corsOptions));


// app.use(cors({ 
// 	// origin: NODE_ENV === 'production' ? CLIENT_ORIGIN : "*",
// 	origin: "https://baburhaat.com",
// 	credentials: true,
// }))

// any pug file got cspNonce variable as global built-in has
app.use((_req, res, next) => {
	res.locals.cspNonce = crypto.randomBytes(16).toString('hex')
	next()
})


// Step-1: set session
app.use(session({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	store: MongoStore.create({ mongoUrl: DATABASE_URL }),
	cookie: {
		httpOnly: true,
		secure: NODE_ENV === 'production',
		// secure: true,
		sameSite: 'none',
    // maxAge: 30 * 24 * 60 * 60 * 1000 // 30 day
	}
}))

// Step-2: attach session with passport
app.use(passport.initialize())
app.use(passport.session())


// Step-3: passport.use(new LocalStrategy(...))
// Step-4: serializeUser + deserializeUser
passportConfig()

// Step-5: app passport.authenticate('local', {...}) 	on 	`POST /login` route


app.set('trust proxy', 1); 																	// Trust the first proxy of Nginx

app.set('query parser', 'simple') 													// To prevent default query query [] parser
app.set('view engine', 'pug')

app.use(express.static( publicDirectory ))
app.use(express.urlencoded({ extended: false })) 						// required for passport login formData
app.use(express.json({ limit: '500mb' }))

app.use('/', routers)

app.get('/api/test', (req, res) => {
	console.log(req.query)

	res.redirect('/api/users')
})

app.all('*', errorController.routeNotFound)
app.use(errorController.globalErrorHandler)

export default app
