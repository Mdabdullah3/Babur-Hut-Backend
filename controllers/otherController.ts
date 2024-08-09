import type { RequestHandler } from 'express';
import { appError, catchAsync } from './errorController';
import { getDataUrlSize } from '../utils';
import * as fileService from '../services/fileService'
import Other from '../models/otherModel';
import { promisify } from 'util';


// GET 	/api/others
export const getOthers: RequestHandler = catchAsync( async (_req, res, _next) => {
	const others = await Other.find()

	res.status(200).json({
		status: 'success',
		total: others.length,
		data: others
	})
})

// GET 	/api/others/:otherId
export const getOtherById: RequestHandler = catchAsync( async (req, res, next) => {
	const { otherId = ''} = req.params

	const other = await Other.findById(otherId)
	if(!other) return next(appError('no other document found'))

	res.status(200).json({
		status: 'success',
		data: other
	})
})

// POST 	/api/others
export const addOther: RequestHandler = catchAsync( async (req, res, next) => {
	try {
		
		if(req.body.image) {
			// check file size
			const imageSize = getDataUrlSize(req.body.image)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))

			// upload file and return { error, image: { public_i, secure_url }}
			const { error: _avatarError, image: image } = await fileService.handleBase64File(req.body.image, '/others')
			// if(avatarError || !image) return next(appError(avatarError))

			if(image) req.body.image = image
		}

		const other = await Other.create(req.body)
		if(!other) return next(appError('no other document found'))

		res.status(201).json({
			status: 'success',
			data: other
		})

	} catch (err: unknown) {
		
		setTimeout(() => {
			if( !req.body.image?.secure_url.startsWith('http') ) {
				promisify(fileService.removeFile)(req.body.image.secure_url)
			}
		}, 1000)

		if(err instanceof Error) next(appError(err.message))
		if(typeof err === 'string') next(appError(err))

	}
})

// PATCH 	/api/others/:otherId
export const updateOther: RequestHandler = catchAsync( async (req, res, next) => {
	try {
		const { otherId = ''} = req.params

		if(req.body.image) {
			// check file size
			const imageSize = getDataUrlSize(req.body.image)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max image size: 5MB(max)'))

			// upload file and return { error, image: { public_i, secure_url }}
			const { error: _avatarError, image: image } = await fileService.handleBase64File(req.body.image, '/others')
			// if(avatarError || !image) return next(appError(avatarError))

			if(image) req.body.image = image
		}

		const other = await Other.findById(otherId )
		if(!other) return next(appError('product not found'))

		const updatedOther = await Other.findByIdAndUpdate(otherId, req.body, { new: true })
		if(!updatedOther) return next(appError('no other document update failed'))

		// delete old image
		if(updatedOther.image && other.image?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(other.image.secure_url)
			}, 1000);
		}


		res.status(201).json({
			status: 'success',
			data: updatedOther
		})

	} catch (err: unknown) {
		
		setTimeout(() => {
			if( req.body.image ) {
				promisify(fileService.removeFile)(req.body.image.secure_url)
			}
		}, 1000)

		if(err instanceof Error) next(appError(err.message))
		if(typeof err === 'string') next(appError(err))
	}
})

// DELETE 	/api/others/:otherId
export const deleteOther: RequestHandler = catchAsync( async (req, res, next) => {
	try {
		const { otherId = ''} = req.params

		const other = await Other.findByIdAndDelete(otherId)
		if(!other) return next(appError('no other document deletation failed'))

		// delete old image
		if(other.image?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(other.image.secure_url)
			}, 1000);
		}

		res.status(204).json({
			status: 'success',
			data: other
		})

	} catch (err: unknown) {
		
		setTimeout(() => {
			if( req.body.image ) {
				promisify(fileService.removeFile)(req.body.image.secure_url)
			}
		}, 1000)

		if(err instanceof Error) next(appError(err.message))
		if(typeof err === 'string') next(appError(err))
	}
})