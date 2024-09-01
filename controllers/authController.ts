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

import type { Session } from 'express-session';
import * as tokenService from '../services/tokenService'
import isEmail from 'validator/lib/isEmail'
 
type CustomSession = Session & {
  state: string;
}

type CustomUser = Express.User & {
	_id: string
}





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


/* POST /api/auth/register 		: add user (register by form)
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
		if(req.body.avatar) {
			// return next(appError('avatar is missing'))
			const imageSize = getDataUrlSize(req.body.avatar)
			const maxImageSize = 1024 * 1024 * 2 			// => 2 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 2MB(max)'))

			const { error, image } = await fileService.handleBase64File(req.body.avatar)
			if(error || !image) return next(appError(error))

			// store into body before other operation, so if any of them failed, error handler geto image
			req.body.avatar = image
		}
		if(req.body.coverPhoto) {
			// return next(appError('coverPhoto is missing'))
			const imageSize = getDataUrlSize(req.body.coverPhoto)
			const maxImageSize = 1024 * 1024 * 2 			// => 2 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 2MB(max)'))

			const { error, image } = await fileService.handleBase64File(req.body.coverPhoto)
			if(error || !image) return next(appError(error))

			// store into body before other operation, so if any of them failed, error handler geto image
			req.body.coverPhoto = image
		}
		if(req.body.idCardFrontPageImage) {
			// return next(appError('coverPhoto is missing'))
			const imageSize = getDataUrlSize(req.body.idCardFrontPageImage)
			const maxImageSize = 1024 * 1024 * 2 			// => 2 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 2MB(max)'))

			const { error, image } = await fileService.handleBase64File(req.body.idCardFrontPageImage)
			if(error || !image) return next(appError(error))

			// store into body before other operation, so if any of them failed, error handler geto image
			req.body.idCardFrontPageImage = image
		}
		if(req.body.idCardBackPageImage) {
			// return next(appError('coverPhoto is missing'))
			const imageSize = getDataUrlSize(req.body.idCardBackPageImage)
			const maxImageSize = 1024 * 1024 * 2 			// => 2 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 2MB(max)'))

			const { error, image } = await fileService.handleBase64File(req.body.idCardBackPageImage)
			if(error || !image) return next(appError(error))

			// store into body before other operation, so if any of them failed, error handler geto image
			req.body.idCardBackPageImage = image
		}
		if(req.body.bankStatementImage) {
			// return next(appError('coverPhoto is missing'))
			const imageSize = getDataUrlSize(req.body.bankStatementImage)
			const maxImageSize = 1024 * 1024 * 2 			// => 2 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 2MB(max)'))

			const { error, image } = await fileService.handleBase64File(req.body.bankStatementImage)
			if(error || !image) return next(appError(error))

			// store into body before other operation, so if any of them failed, error handler geto image
			req.body.bankStatementImage = image
		}

		const filteredBody = userDto.filterBodyForCreateUser(req.body)

		const userFound = await User.findOne({ email: req.body.email })
		if(userFound) return next(appError('This email already registerted'))

		const user = await User.create(filteredBody)
		if(!user) return next(appError('user not found'))



		// send email to active account instead of success response
		
		res.status(201).json({
			status: 'success',
			data: user
		})

	} catch (err: unknown) {
		if(req.body.avatar?.secure_url)  {
			setTimeout(() => {
				promisify(fileService.removeFile)(req.body.avatar.secure_url)
			}, 1000)
		}
		if(req.body.coverPhoto?.secure_url)  {
			setTimeout(() => {
				promisify(fileService.removeFile)(req.body.coverPhoto.secure_url)
			}, 1000)
		}
		if(req.body.idCardFrontPageImage?.secure_url)  {
			setTimeout(() => {
				promisify(fileService.removeFile)(req.body.idCardFrontPageImage.secure_url)
			}, 1000)
		}
		if(req.body.idCardBackPageImage?.secure_url)  {
			setTimeout(() => {
				promisify(fileService.removeFile)(req.body.idCardBackPageImage.secure_url)
			}, 1000)
		}
		if(req.body.bankStatementImage?.secure_url)  {
			setTimeout(() => {
				promisify(fileService.removeFile)(req.body.bankStatementImage.secure_url)
			}, 1000)
		}

		if( err instanceof Error) next(appError(err.message))
		if( typeof err === 'string') next(appError(err))
	}
}


/* POST /api/auth/login
{
  "email": "riajul@gmail.com",
  "password": "{{pass}}"
}
*/
export const login:RequestHandler = catchAsync( async (req, res, next) => {
	// console.log(req.body)
	if(!req.body.email || !req.body.password) return next(appError('please pass email and password'))
	
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


// => POST /api/auth/logout 		: // use POST, DELETE request, so that accedently not logout by refreshing page or something
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





// GET /auth/google/ 		=> 	/api/auth/google 	(Proxy Reverse For API)
export const googleLoginRequest:RequestHandler = catchAsync( async (req, res, next) => {
  // const state = generateRandomState(); 				// Generate a unique state parameter
  const state = crypto.randomUUID(); 							// Semi-clone required because next line type casting
  (req.session as CustomSession).state = state; 	// Store the state in the session

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: state 																	// Include the state in the request to Google
  })(req, res, next);
})


// GET /auth/google/callback 		=> 	/api/auth/google/callback 	(Proxy Reverse For API)
export const googleCallbackHandler:RequestHandler = catchAsync( async (req, res, next) => {

	 passport.authenticate('google', (err: unknown, user: CustomUser ) => {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/auth/failure'); }

    // // Validate the state parameter to prevent CSRF attacks
    // if (req.query.state !== (req.session as CustomSession).state) {
    //   return next(appError('invalid state parameter', 403, 'GoogleError'))
    //   // return res.status(403).send('Invalid state parameter');
    // }

		console.log({ 
			state: req.query.state, 
			sessionState1: (req.session as CustomSession).state 
		})

    req.logIn(user, async (err) => {
      if (err) { 
				console.log('google authentication error', err)
				return next(err); 
			}

		  const isFlutterApp = req.headers['user-agent']?.includes('flutter') || req.query.flutter;

      if (isFlutterApp) {
        const token = await tokenService.generateTokenForUser(user._id); // Implement your token generation logic
        res.json({ status: 'success', data: { token } });
				console.log({ flutter: token })

      } else {
        const authToken = await tokenService.generateTokenForUser(user._id); // Implement your token generation logic
        res.redirect(`/api/auth/google/success/?authToken=${authToken}`);


      }
    });
  })(req, res, next);

})


// GET /auth/google/ 		=> /api/auth/google/success/?authToken={authToken} 
export const googleSuccessHandler: RequestHandler = catchAsync( async (req, res, next) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authToken = req.query.authToken as any
	// console.log({ googleSuccessHandler: authToken })

	if(!authToken) return next(appError('No authToken: authentication failed'))

	if(typeof authToken === 'string') {
		const isVerifiedToken = await tokenService.verifyUserAuthToken(authToken) 
		if(!isVerifiedToken) return next(appError('authenticate validation failed'))

	} else throw next(appError(`authToken: ${authToken}`))

	const isVerifiedToken = await tokenService.verifyUserAuthToken(authToken) 
	if(!isVerifiedToken) return next(appError('authenticate validation failed'))

	const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN
	if(CLIENT_ORIGIN) {
	 	res.redirect(CLIENT_ORIGIN)
	 	return
	}

	res.json({
		status: 'success',
		data: {
			authToken
		}
	})

})


// GET  /auth/failure 		=>	/api/auth/failure 	(Proxy Reverse For API)
export const googleAuthFailure:RequestHandler = catchAsync( async (_req, _res, next) => {
	next(appError('google authentication failed', 401, 'GoogleAuthFailed'))
})


// // Previous
// // GET /auth/google/callback 		+ 	/api/auth/google/callback 	(For API)
// export const googleCallbackHandler:RequestHandler = catchAsync( async (req, res, next) => {
// 	// console.log(req.body)
	
// 	passport.authenticate('google', (err: unknown, user: Express.User) => {
// 		if(err) return next(err)
// 		if(!user) return next(appError('user not found'))

// 		req.login(user, (logError) => {
// 			if(logError) return next(logError)

// 			// res.redirect('/')
// 			// res.redirect('https://baburhaatbd.com') instead of json


// 			res.json({
// 				status: 'success',
// 				data: user
// 			})
// 		})
// 	})(req, res, next)

// })


/* PATCH /auth/update-password 	+ protect
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

	const logedInUser = req.user as LogedInUser

	// const user = await User.findOne().select('+password')
	const user = await User.findById(logedInUser._id).select('+password')
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
	if(!isEmail(email)) return next(appError(`invalid email: ${email}`))

	const user = await User.findOne({ email })
	if(!user) return next(appError(`you are not registerted user, please register first`))

	const resetToken = await user.getPasswordResetToken()

	try {
		await sendMail({
			to: email,
			subject: 'Password Reset Token | baburhaatbd.com',
			text: `resetToken: ${resetToken}`
		})

	} catch (error: unknown) {
		if(error instanceof Error) return next(appError(error.message, 401, 'ResetPasswordTokenError'))		

		if( typeof error === 'string')
		return next(appError(error, 400, 'ResetPasswordTokenError'))		
	}


	res.status(200).json({
		status: 'success',
		message: `token sent to ${email}`
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
		const data = await otpService.sendSMS(phone, otp) 				// get twilio details first
		if(data.error) return next( appError(data.msg, data.error, 'OTP_ERROR') )
		console.log(data)

		// await sendMail({
		// 	to: 'your_target_user@gmail.com',
		// 	subject: 'Testing | sending OTP via email',
		// 	text: `otp: ${otp}`
		// })

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

	if (process.env.NODE_ENV === 'development') console.log({ otp })

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
	"role": "admin",
	"hash": "Lp+1ufeABW9LtlInKNI1Des6nSNYzcttp0I5tHtZVDI=.1719580163272"
}
*/

export const verifyOTP = catchAsync( async (req, res, next) => {
	const { phone, otp, hash } = req.body
	if(!phone || !otp || !hash) return next(appError('you must send: { phone, otp, hash: hashedOTP }'))

	req.body.role = 'vendor'

	// step-1: check expires
	const [ hashedOTP, expires ] = hash.split('.')

	const isValidHashed = expires > Date.now()
	if(!isValidHashed) return next(appError('your OTP expires, please collect new OTP', 401, 'TokenError'))

	// step-2: check hashed hash
	const data = `${phone}.${otp}.${expires}` 			// get the same pattern from send otp
	const isValid = await hashService.validateOTP(data, hashedOTP)
	if(!isValid) return next(appError('hashed otp violated'))

	const	otpDoc = await OtpModel.findOneAndDelete({ phone })
	if(!otpDoc) return next(appError('please retry with your new otp'))


	// step-3: Create user
	let user = await User.findOne({ phone })
	const password = crypto.randomBytes(6).toString('hex')
	if(!user) {
		const requiredFields = {
			// email: phone, 																		// just to prevent empty duplication error
			phone,
			name: crypto.randomBytes(4).toString('hex'), 			// => 590e4eec
			password,
			confirmPassword : password,
			isActive: true,
		}
		user = await User.create(requiredFields)
	}

	user.password = password


	// step-4: login User 
	req.logIn(user, (err) => {
		if(err) return next(err)

		res.status(200).json({
			status: 'success',
			message: 'given a random password for later login, fill free to change you password any time',
			data: user
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




//-------------------------[ Update Email via Email ]-------------------------

// POST 	/api/auth/update-email 	+ auth				: for email change with email varification
export const sendUpdateEmailRequest = catchAsync(async (req, res, next) => {
	const { email } = req.body
	if(!email ) return next(appError('email field must required'))
	if(!isEmail(email) ) return next(appError(`${email} is not valid email.`))

	const logedInUser = req.user as LogedInUser
	const userId = logedInUser._id

	const user = await User.findById(userId)
	if(!user ) return next(appError('no user found'))
  const resetToken = await user.createEmailResetToken()

	const subject = `To Change Email: ${logedInUser.name} (only valid for 10 minutes)`
  let text = 'Please copy/paste the bellow url or click to update your email: \n'
      // text += `${req.protocol}://${req.get('host')}/api/auth/update-email/${resetToken}?email=${email}`
      text += `${process.env.CLIENT_ORIGIN}/api/auth/update-email/${resetToken}?email=${email}`
			

	try {
		await sendMail({ to: email, subject, text })

	} catch (error: unknown) {
		if(error instanceof Error) return next(appError(error.message, 401, 'EmailUpdateError'))		

		if( typeof error === 'string')
		return next(appError(error, 400, 'EmailUpdateError'))		
	}


	res.status(201).json({
		status: 'success', 
		message: `an email is send to ${email} to change email`,

		// data: {
		// 	subject, text, resetToken
		// }
	})
})


// GET 	/api/auth/update-email/:resetToken 	
export const updateEmail = catchAsync(async (req, res, next) => {
	const { resetToken } = req.params
	if(!resetToken ) return next(appError('resetToken not found must'))

	const { email } = req.query
	if(!email ) return next(appError('email field must required'))
	if(typeof email != 'string') return next(appError('email must be string'))

	const logedInUser = req.user as LogedInUser
	const userId = logedInUser._id

	const user = await User.findById(userId)
	if(!user) return next(appError('no user found'))

	const isEmailUpdated =  await user.handleEmailUpdate(resetToken, email) 
	if(!isEmailUpdated) return next(appError('email update failed: make sure you have request for sendUpdateEmailRequest '))
	

	res.status(201).json({
		status: 'success', 
		data: {
			user
		}
	})
})


//-------------------------[ Update Phone Number via OTP ]-------------------------

// POST 	/api/auth/update-phone 	+ auth				: for phone change with otp varification
export const sendUpdatePhoneRequest = catchAsync(async (req, res, next) => {
	const { phone } = req.body
	if(!phone ) return next(appError('phone field must required'))

	// const logedInUser = req.user as LogedInUser

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
		const data = await otpService.sendSMS(phone, otp) 				
		if(data.error) return next( appError(data.msg, data.error, 'OTP_ERROR') )
		console.log(data)

		// await sendMail({
		// 	to: 'your_target_user@gmail.com',
		// 	subject: 'Testing | sending OTP via email',
		// 	text: `otp: ${otp}`
		// })

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

	if (process.env.NODE_ENV === 'development') console.log({ otp })

	res.status(201).json({
		status: 'success', 
		data: {
			message: `an otp message is send to you via SMS`, 
			phone,
			hash: `${hashedOtp}.${expires}`, 				// send phone, expires + hashedOTP which will be require later
		}
	})
})

// PATCH 	/api/auth/update-phone/
export const updatePhone = catchAsync( async (req, res, next) => {
	const { phone, otp, hash } = req.body
	if(!phone || !otp || !hash) return next(appError('you must send: { phone, otp, hash: hashedOTP }'))

	const logedInUser = req.user as LogedInUser
	const userId = logedInUser._id

	// step-1: check expires
	const [ hashedOTP, expires ] = hash.split('.')

	const isValidHashed = expires > Date.now()
	if(!isValidHashed) return next(appError('your OTP expires, please collect new OTP', 401, 'TokenError'))

	// step-2: check hashed hash
	const data = `${phone}.${otp}.${expires}` 			// get the same pattern from send otp
	const isValid = await hashService.validateOTP(data, hashedOTP)
	if(!isValid) return next(appError('hashed otp violated'))

	const	otpDoc = await OtpModel.findOneAndDelete({ phone })
	if(!otpDoc) return next(appError('please retry with your new otp'))

	// step-3: Create user
	const user = await User.findByIdAndUpdate(userId, { phone }, { new: true })
	if(!user) return next(appError('user update failed with phone field'))


	// // step-4: login User 
	// req.logIn(user, (err) => {
	// 	if(err) return next(err)

	// 	res.status(200).json({
	// 		status: 'success',
	// 		message: 'given a random password for later login, fill free to change you password any time',
	// 		data: user 
	// 	})
	// })


	res.status(200).json({
		status: 'success',
		data: user
	})

})




