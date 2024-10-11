import type { Express } from 'express'
import path from 'node:path'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'
import MongoStore from 'connect-mongo'
import morgan from 'morgan'

import routers from './routes'
import * as errorController from './controllers/errorController'
import { passportConfig } from './controllers/passportConfig'
import { dbConnect } from './models/dbConnect'


dbConnect() 		
errorController.exceptionErrorHandler() 


const { SESSION_SECRET,  MONGO_HOST, NODE_ENV } = process.env || {}
const publicDirectory = path.join(process.cwd(), 'public')

const DATABASE_URL = `mongodb://${MONGO_HOST}/babur-hat`
if(!MONGO_HOST) throw new Error(`Error => MONGO_HOST: ${MONGO_HOST}`)
if(!SESSION_SECRET) throw new Error(`Error: => SESSION_SECRET=${SESSION_SECRET}`)


const app: Express = express()

const allowedOrigins = [
	'https://baburhaatbd.com', 					// main
	'http://baburhaatbd.com',
	'https://baburhaatbd.com:3000',
	'http://baburhaatbd.com:3000',
	'https://103.148.15.24:3000', 
	'http://103.148.15.24:3000', 
	'http://localhost:3000', 

	'https://vendor.baburhaatbd.com', 	// vendor
	'https://baburhaatbd.com:3001',
	'http://baburhaatbd.com:3001',
	'http2://103.148.15.24:3001',  			// vendor
	'http://103.148.15.24:3001',  			// vendor
	'https://103.148.15.24:3001', 
	'http://103.148.15.24:3001', 
	'http://localhost:3001', 

	'https://admin.baburhaatbd.com', 		// admin
	'https://baburhaatbd.com:3002',
	'http://baburhaatbd.com:3002',
	'http2://103.148.15.24:3002',  			// admin
	'http://103.148.15.24:3002',  			// admin
	'http://localhost:3002', 

	'https://baburhaatbd.com:5000',
	'http://baburhaatbd.com:5000',
	'https://103.148.15.24:5000', 
	'http://103.148.15.24:5000', 
	'http://localhost:5000', 

	'https://babur-hut-dashboard.vercel.app/',
	'https://babur-hat.vercel.app/',
]

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




// Step-1: set session
app.use(session({
	secret: SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	store: MongoStore.create({ mongoUrl: DATABASE_URL }),
	cookie: {
		httpOnly: true,
		secure: NODE_ENV === 'production',
		sameSite: 'none',
	}
}))

// Step-2: attach session with passport
app.use(passport.initialize())
app.use(passport.session())


// Step-3: passport.use(new LocalStrategy(...))
// Step-4: serializeUser + deserializeUser
passportConfig()

// Step-5: app passport.authenticate('local', {...}) 	on 	`POST /login` route


app.set('trust proxy', 1); 																	// Trust the proxy, which coming via Nginx

app.set('query parser', 'simple') 													// To prevent default query query [] parser
app.set('view engine', 'pug')

app.use(express.static( publicDirectory ))
app.use(express.json({ limit: '400mb' }));
app.use(express.urlencoded({ limit: '400mb', extended: true }));

app.use(morgan('dev')) 					// 
app.use('/', routers)

app.all('*', errorController.routeNotFound)
app.use(errorController.globalErrorHandler)

export default app
