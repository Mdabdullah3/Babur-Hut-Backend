// used in app.js
import passport from 'passport'
// import { Strategy as LocalStrategy } from 'passport-local'
import * as localStrategy from 'passport-local'
// import { Strategy as OAuth2Strategy } from 'passport-google-oauth2'
import * as oAuth2Strategy from 'passport-google-oauth2'
import bcryptjs from 'bcryptjs'
import User from '../models/userModel'
import { appError } from './errorController'


export const passportConfig = () => {
	const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env || {}
	if( !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET ) throw new Error('google client or secret is missing') 


	passport.use(new localStrategy.Strategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true 					// now (username, password, done) => (req, email, password, done)
	}, async (_req, email, password, done) => {


		try {
			// const filter = { }
			const user = await User.findOne({ email }).select('+password')

			if(!user) return done(appError(`No user found with this ${email}`, 401, 'AuthError') , false )

			const isPasswordVarified = bcryptjs.compareSync( password, user.password )
			if(!isPasswordVarified) return done(appError(`wrong password`, 401, 'AuthError'), false )

			return done(null, user)

		} catch (err: unknown) {
			if(err instanceof Error) return done(appError(err.message, 401, 'AuthError'), false)
			if( typeof err === 'string') return done(appError(err, 401, 'AuthError'), false)
		}
	}))


	passport.use( new oAuth2Strategy.Strategy({
		clientID: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		callbackURL: '/auth/google/callback', 							// same as origin-redirect: 	if request this route will show google login popup window
		scope: ['profile', 'email'] 												// ?
	}, async (_accessToken, _refreshToken, profile, done) => {
		try {
			let user = await User.findOne({ clientId: profile.id })
			if(!user) {
				const randomValue = `password-${Math.random() * 100000000}` 		
				// use ramdom password so that schema validation pass

				user = await User.create({
					clientId: profile.id,
					name: profile.displayName,
					email: profile.emails[0].value,
					avatar: {
						public_id: '',
						secure_url: profile.photos[0].value,
					},
					password: randomValue,
					confirmPassword: randomValue
				})
				if(!user) return done(appError('create user in database is failed', 401, 'AuthError'), false)
			}

			return done(null, user)

		} catch (err: unknown) {
			if(err instanceof Error) return done(appError(err.message, 401, 'AuthError'), false)
			if( typeof err === 'string') return done(appError(err, 401, 'AuthError'), false)
		}
	}))



	passport.serializeUser((user: { id?: number }, done) => {
		done(null, user.id)
	});

	passport.deserializeUser( async (userId, done) => {
		try {
			const user = await User.findById(userId)
			if(!user) return done('user not find while deserializeUser' , false)
			// if(!user) return done(null, false, { message: 'user not find while deserializeUser' })

			done(null, user)

		} catch (err) {
			done(err)
		}
	})
}

