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


/* POST /api/users/register 		: add user
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

