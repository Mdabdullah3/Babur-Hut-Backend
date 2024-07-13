import type { NextFunction, Request, RequestHandler, Response } from 'express'
import type { LogedInUser } from '../types/user'
import { promisify } from 'node:util'
import crypto from 'node:crypto'
import passport from 'passport'
import { appError, catchAsync } from './errorController'
import User from '../models/userModel'
import * as fileService from '../services/fileService'
import * as userDto from '../dtos/userDto'
import { getDataUrlSize } from '../utils'
import * as otpService from '../services/otpService'
import * as hashService from '../services/hashService'
import OtpModel from '../models/otpModel'
import { sendMail } from '../utils/nodemailer'


// router.get('/api/users' protect, ...)
export const protect:RequestHandler = (req, res, next) => {
	if(req.isAuthenticated()) {

		// // if .isActive => true then allow
		// const user = req.user as UserDocument
		// if(!user.isActive) return next(appError('you are not active, please checkout email', 401, 'AuthError'))

		return next()
	}
	
	const errorMessage = 'you are not authenticated user, plsese login first'
	if( req.originalUrl.startsWith('/api') ) return next(appError(errorMessage, 401, 'AuthError'))
	res.redirect('/login')
}


// router.get('/api/users' protect, restrictTo('admin', 'leader'), getAllUsers)
export const restrictTo = (...roles: string[]) => (req:Request, _res:Response, next:NextFunction) => {
	const user = req.user as LogedInUser

	const message = `Sorry you ( role: '${user.role}' ) don't have permission to perform this action.`
	if(!roles.includes(user.role)) return next(appError(message, 403, 'PermissionDenied'))

	next()
}


/* POST /api/users/register 		: add user (register by form)
{
  "name" : "delete me",
	"email" : "delete@gmail.com",
	"password" : "asdfasdf",
	"confirmPassword" : "asdfasdf",
	"role" : "admin",
	"avatar" : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
}
*/
export const register:RequestHandler = async (req, res, next) => {
	try {
		if(!req.body.avatar) return next(appError('avatar is missing'))

		const imageSize = getDataUrlSize(req.body.avatar)
		const maxImageSize = 1024 * 1024 * 2 			// => 2 MB
		if(imageSize > maxImageSize) return next(appError('You cross the max image size: 2MB(max)'))

		const { error, image } = await fileService.handleBase64File(req.body.avatar)
		if(error || !image) return next(appError(error))

		// store into body before other operation, so if any of them failed, error handler geto image
		req.body.avatar = image

		const filteredBody = userDto.filterBodyForCreateUser(req.body)

		const user = await User.create(filteredBody)
		if(!user) return next(appError('user not found'))



		// send email to active account instead of success response
		
		res.status(201).json({
			status: 'success',
			data: user
		})

	} catch (err: unknown) {
		if(!req.body.avatar?.secure_url)  return next(appError('avatar?.secure_url is empty'))

		setTimeout(() => {
			promisify(fileService.removeFile)(req.body.avatar.secure_url)
		}, 1000)

		if( err instanceof Error) next(appError(err.message))
		if( typeof err === 'string') next(appError(err))
	}
}


/* POST /api/users/login
{
  "email": "riajul@gmail.com",
  "password": "{{pass}}"
}
*/
export const login:RequestHandler = catchAsync( async (req, res, next) => {
	// console.log(req.body)
	
	passport.authenticate('local', (err: unknown, user: Express.User) => {
		if(err) return next(err)
		if(!user) return next(appError('user not found'))

		req.login(user, (logError) => {
			if(logError) return next(logError)

			// res.redirect('/')

			res.json({
				status: 'success',
				data: user
			})

		})
	})(req, res, next)

})


// => POST /api/users/logout 		: // use POST, DELETE request, so that accedently not logout by refreshing page or something
export const logout:RequestHandler = (req, res, next) => {
	req.logout((err) => {
		if(err) return next(err)

		// res.redirect('/login')
		res.status(200).json({
			status: 'success',
			message: 'logout success'
		})
	})
}



// GET /auth/google/callback 		: Not /api/auth/google/callback
export const googleCallbackHandler:RequestHandler = catchAsync( async (req, res, next) => {
	// console.log(req.body)
	
	passport.authenticate('google', (err: unknown, user: Express.User) => {
		if(err) return next(err)
		if(!user) return next(appError('user not found'))

		req.login(user, (logError) => {
			if(logError) return next(logError)

			// res.redirect('/')

			res.json({
				status: 'success',
				data: user
			})
		})
	})(req, res, next)

})


/* PATCH /auth/update-password
{
  "currentPassword": "asdfasdff",
  "password": "asdfasdf",
  "confirmPassword": "asdfasdf"
}
*/
export const updatePassword:RequestHandler = catchAsync( async (req, res, next) => {
	const missingFieldsError = 'you must provide currentPassword, password, confirmPassword fields'

  const { currentPassword, password, confirmPassword } = req.body
	if(!currentPassword || !password || !confirmPassword) return next(appError(missingFieldsError))
	if(currentPassword === password ) return next(appError(`please choose different password than currentPassword`))

	const user = await User.findOne().select('+password')
	if(!user?.password) return next(appError('missing password from user document'))

	// const isAuthenticated = bcryptjs.compareSync(currentPassword, user?.password)
	const isAuthenticated = await user.comparePassword(currentPassword)
	if(!isAuthenticated) return next(appError('your currentPassword is incorrect, did you forgot your password?'))

	user.password = password 
	user.confirmPassword = confirmPassword
	const updatedUser = await user.save({ validateBeforeSave: true })
	updatedUser.password = ''
	updatedUser.confirmPassword = ''

	req.logout( (err) => {
		if(err) return next(appError('logout failed'))

		res.status(200).json({
			status: 'success',
			data: updatedUser
		})
		return
	})

	// // req.session.destroy(err => next(appError(err)))
	// res.status(200).json({
	// 	status: 'success',
	// 	data: user
	// })

})


/* POST /auth/forgot-password
{
	"email": "abc@gmail.com"
}
*/
export const forgotPassword:RequestHandler = catchAsync( async (req, res, next) => {
	const { email } = req.body
	if(!email) return next(appError('email fields is mandatory'))

	const user = await User.findOne({ email })
	if(!user) return next(appError(`you are not registerted user, please register first`))

	const resetToken = await user.getPasswordResetToken()

	res.status(200).json({
		status: 'success',
		resetToken
	})

})

/* PATCH /auth/reset-password
{
  "resetToken" : "8a25491050a62334fb1ec5ca4a14c43aaebcdb5f6813806e9fda66e67a0decbd",
  "password": "{{pass}}",
  "confirmPassword": "{{pass}}"
}
*/
export const resetPassword:RequestHandler = catchAsync( async (req, res, next) => {
	const { resetToken, password, confirmPassword } = req.body
	if(!resetToken || !passport || !confirmPassword) return next(appError('must provide: resetToken, password, confirmPassword'))

	const digestToken = crypto.createHash('sha256').update(resetToken).digest('hex')
	if(!digestToken) return next(appError('passwordResetToken validation failed, please try again'))

	const user = await User.findOne({ passwordResetToken: digestToken })
	if(!user) return next(appError('no user found, may be your resetToken not valid any more'))

	user.password = password
	user.confirmPassword = confirmPassword
	user.passwordResetToken = undefined
	user.updatedAt = new Date()
	const updatedUser = await user.save({ validateBeforeSave: true })

	updatedUser.password = ''

	res.status(200).json({
		status: 'success',
		data: updatedUser
	})

})


/*
*/
// ---
// const userService = require('../services/userService')
// const tokenService = require('../services/tokenService')
// const fileService = require('../services/fileService')
// const userDto = require('../dtos/userDto')


// POST 	/api/auth/send-otp 
/* We can store hashed otp in database:
		. store into database is reduce complexity
		. send user both otp and hashedOTP + expires date  + phone number: when need to varify get from user again.
*/
export const sendOTP = catchAsync( async(req, res, next) => {
	const { phone } = req.body
	if(!phone) return next(appError('you must send: `phone` property '))

	// Step-1: 
	const otp = await otpService.generateOTP()

	/* Step-2: To send user otp and hashedOtp too, so that no need to store 
						into database, and later get hashedOtp back from client to validate
	*/
	const ttl = 1000 * 60 * 50 						// => TTL = Time To Live
	const expires = Date.now() + ttl
	const data = `${phone}.${otp}.${expires}`
	const hashedOtp = await hashService.hashOTP(data)

	// Step-3: 
	try {
		// await otpService.sendSMS(phone, otp) 				// get twilio details first
		await sendMail({
			from: 'letmeexplore01@gmail.com',
			to: 'your_target_user@gmail.com',
			subject: 'Testing | sending OTP via email',
			text: `otp: ${otp}`
		})

	} catch (error: unknown) {
		if(error instanceof Error) return next(appError(error.message, 401, 'OTP_error'))		

		if( typeof error === 'string')
		return next(appError(error, 400, 'OTP_error'))		
	}

	// save phone number into database temporaryly, after verify will delete and create user
	let otpDoc = await OtpModel.findOne({ phone })
	if(!otpDoc) {
		otpDoc = await OtpModel.create({ phone })
		if(!otpDoc) return next(appError('phone number can not save into otp model'))
	}

	console.log('authController.sendOTP', { otp }) 	// require for local testing

	res.status(200).json({
		status: 'success',
		data: {
			message: `an otp message is send to you via SMS`, 
			phone,
			hash: `${hashedOtp}.${expires}`, 				// send phone, expires + hashedOTP which will be require later
		}
	})
})


/* POST 	/api/auth/verify-otp  	
body {
	"otp": 8430,
	"phone": "01957500605",
	"hash": "Lp+1ufeABW9LtlInKNI1Des6nSNYzcttp0I5tHtZVDI=.1719580163272"
}
*/
export const verifyOTP = catchAsync( async (req, res, next) => {
	const { phone, otp, hash } = req.body

	if(!phone || !otp || !hash) return next(appError('you must send: { phone, otp, hash: hashedOTP }'))

	// step-1: check expires
	const [ hashedOTP, expires ] = hash.split('.')

	const isValidHashed = expires > Date.now()
	if(!isValidHashed) return next(appError('your OTP expires, please collect new OTP', 401, 'TokenError'))

	// step-2: check hashed hash
	const data = `${phone}.${otp}.${expires}` 			// get the same pattern from send otp
	const isValid = await hashService.validateOTP(data, hashedOTP)
	if(!isValid) return next(appError('hashed otp violated'))


	// const	otpDoc = await OtpModel.findOneAndUpdate({ phone }, { $set: { isVerified: true }}, { new: true })
	const	otpDoc = await OtpModel.findOneAndDelete({ phone })
	if(!otpDoc) return next(appError('please retry with your new otp'))
	// console.log(otpDoc)

	// step-3: Create user
	let user = await User.findOne({ phone })
	const password = crypto.randomBytes(6).toString('hex')
	if(!user) {
		const requiredFields = {
			phone,
			name: crypto.randomBytes(4).toString('hex'), 								// => 590e4eec
			password,
			confirmPassword : password,
			isVerified: true,
			isActive: true,
		}
		user = await User.create(requiredFields)
	}


	// step-4: login User 
	req.logIn(user, (err) => {
		if(err) return next(err)

		res.status(200).json({
			status: 'success',
			message: 'given a random password for later login, fill free to change you password any time',
			data: { ...user, password }
		})

	})


	// res.status(200).json({
	// 	status: 'success',
	// 	data: {
	// 		name: user.name,
	// 		password,
	// 		message: 'temporary password, you shold change it later',
	// 	},
	// })

})



// // otp-create user middleware
// // post('/otp-registration', authController.otpLoginMiddleware, authController.register)
// export const otpLoginMiddleware:RequestHandler = catchAsync( async (req, _res, next) => {
// 	// const otpDoc = await OtpModel.findOne({ phone: req.body.phone })
// 	// if(!otpDoc) return next(appError('please get otp first, before going to create account'))

// 	// if(!otpDoc.isVerified) return next(appError('please verify otp first, before going to create account'))
// 	// next()


// 	const password = crypto.randomBytes(6).toString('hex')

// 	const requiredFields = {
// 		phone,
// 		name: crypto.randomBytes(4).toString('hex'), 								// => 590e4eec
// 		password,
// 		confirmPassword : password
// 	}
// 	const user = await User.create(requiredFields)

// })

/*
		// check is user otp verified: by phone number
		if(req.body.phone) {
			const otpDoc = await OtpModel.findOne({ phone: req.body.phone })
			if(!otpDoc) return next(appError('please get otp first, before going to create account'))
			if(!otpDoc.isVerified) return next(appError('please verify otp first, before going to create account'))

			filteredBody.isVerified = true

			otpDoc.deleteOne({ phone: req.body.phone })
		}
*/
		


// // PATCH 	/api/auth/active-user + auth
// exports.activeUser = catchAsync(async (req, res, next) => {
// 	const { name, avatar } = req.body
// 	if(!name || !avatar) return next(appError('missing fields: [name,avatar]'))

// 	const { error, url } = await fileService.handleBase64File(avatar)
// 	if(error) return next(appError(error))

// 	const userId = req.userId
// 	const user = await userService.activeUser(userId, { name, avatar: url, isActive: true })
// 	if(!user) return next(appError('update user failed'))

// 	res.status(201).json({
// 		status: 'success', 
// 		data: {
// 			user: userDto.filterUser(user._doc)
// 		}
// 	})
// })

