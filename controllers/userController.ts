import type { RequestHandler } from 'express'
import type { LogedInUser, UserDocument } from '../types/user'
import User from '../models/userModel'
import { appError, catchAsync } from './errorController'
import { apiFeatures, getDataUrlSize } from '../utils'
import * as userDto from '../dtos/userDto'
import * as fileService from '../services/fileService'
import { promisify } from 'node:util'
// import Product from '../models/productModel'
// import { isValidObjectId } from 'mongoose'

/*
{
	"name" : "Riajul Islam",
	"email" : "riajul@gmail.com",
	"password" : "asdfasdf",
	"confirmPassword?" : "asdfasdf",
	"avatar" : "/upload/images/avatar.jpg",
}
*/

// GET /api/users
export const getAllUsers:RequestHandler = catchAsync( async (req, res, _next) => {
	// const users = await User.find<UserDocument>()
	const filter = {}
	const users:UserDocument[] = await apiFeatures(User, req.query, filter)

	res.status(200).json({
		status: 'success',
		total: users.length,
		data: users
	})
})


// GET /api/users/:id
export const getUserById:RequestHandler = catchAsync(async (req, res, next) => {
	const userId = req.params.id
	const filter = { _id: userId }

	// const user = req.user as UserDocument
	// console.log(user.role)

	const users = await apiFeatures(User, req.query, filter).limit(1)
	if(!users.length) return next(appError('user not found'))
	
	res.status(200).json({
		status: 'success',
		data: users[0]
	})
})

// GET /api/users/me 	+ authController.protect
export const getMe:RequestHandler = catchAsync(async (req, res, next) => {
	const logedInUser = req.user as LogedInUser

	const user = await User.findById(logedInUser._id)
	if(!user) return next(appError('user not found'))
	
	res.status(200).json({
		status: 'success',
		data: user
	})
})



// PATCH /api/users/me 	+ authController.protect
export const updateMe: RequestHandler = (req, _res, next) => {
	const logedInUser = req.user as LogedInUser

	req.params.id = logedInUser._id.toString()

	next()
}

// PATCH /api/users/:id
export const updateUserById:RequestHandler = async (req, res, next) => {
	const userId = req.params.id

	try {
		// if not self nor admin then don't allow to update
		const logedInUser = req.user as LogedInUser
		const isSelf = logedInUser._id.toString() === userId
		const isAdmin = logedInUser.role === 'admin'

		if(!isSelf) {
			if(!isAdmin) return next(appError('only self or admin user can update others user'))
		}

		if(req.body.coverPhoto) {
			const imageSize = getDataUrlSize(req.body.coverPhoto)
			const maxImageSize = 1024 * 1024 * 2 			// => 2 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 2MB(max)'))

			const { error: _message, image } = await fileService.handleBase64File(req.body.coverPhoto)
			// if(message || !image) return next(appError(message))

			if(image) req.body.coverPhoto = image
		}

		if(req.body.avatar) {
			const imageSize = getDataUrlSize(req.body.avatar)
			const maxImageSize = 1024 * 1024 * 2 			// => 2 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 2MB(max)'))

			const { error: _message, image } = await fileService.handleBase64File(req.body.avatar)
			// if(message || !image) return next(appError(message))

			if(image) req.body.avatar = image
		}

		const filteredBody = userDto.filterBodyForUpdate(req.body)

		const user = await User.findById(userId)
		if(!user) return next(appError(`user not found by: ${userId}`))

		// console.log({ body: filteredBody })

		// const updatedUser = await User.findOne({ _id: userId }, filteredBody)
		const updatedUser = await User.findOneAndUpdate({ _id: userId }, filteredBody)
		if(!updatedUser) return next(appError('review not found'))
		
		// remove old image
		if(user.coverPhoto) {
			promisify(fileService.removeFile)(user.coverPhoto.secure_url)
		}
		if(user.avatar) {
			promisify(fileService.removeFile)(user.avatar.secure_url)
		}


		res.status(200).json({
			status: 'success',
			data: updatedUser
		})

	} catch (error) {
		if(req.body.coverPhoto?.secure_url) {
			promisify(fileService.removeFile)(req.body.coverPhoto.secure_url)
		}
		if(req.body.avatar?.secure_url) {
			promisify(fileService.removeFile)(req.body.avatar.secure_url)
		}
		if(error instanceof Error) next(appError(error.message))
		if(typeof error === 'string') next(appError(error))
	}

}



// DELETE /api/users/me 	+ authController.protect
export const deleteMe: RequestHandler = (req, _res, next) => {
	const logedInUser = req.user as LogedInUser

	req.params.id = logedInUser._id.toString()

	next()
}

// DELETE /api/users/:id
export const deleteUserById:RequestHandler = catchAsync(async (req, res, next) => {
	const userId = req.params.id

	// if not self nor admin then don't allow to delete
	const logedInUser = req.user as LogedInUser
	const isSelf = logedInUser._id.toString() === userId
	const isAdmin = logedInUser.role === 'admin'

	if(!isSelf) {
		if(!isAdmin) return next(appError('only self or admin user can delete others user'))
	}

	const user = await User.findByIdAndDelete(userId)
	if(!user) return next(appError('review not found'))
	
	if(user.coverPhoto) {
		promisify(fileService.removeFile)(user.coverPhoto.secure_url)
	}
	if(user.avatar) {
		promisify(fileService.removeFile)(user.avatar.secure_url)
	}
	
	/* deleting userIds from products .likes 
			- if user has 3 product Ids in likes array, then find product by that ids and delete
	*/
	// await User.findByIdAndUpdate(product.user, { "$pull": { likes: productId }}, { new: true, }) 	
	
	res.status(204).json({
		status: 'success',
		data: user
	})
})