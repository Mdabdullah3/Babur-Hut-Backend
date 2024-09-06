import type { RequestHandler } from 'express';
import { appError, catchAsync } from './errorController';
import { apiFeatures, getDataUrlSize } from '../utils';
import * as fileService from '../services/fileService'
import Other from '../models/otherModel';
import { promisify } from 'util';


// GET 	/api/others
export const getOthers: RequestHandler = catchAsync( async (req, res, _next) => {
	// const others = await Other.find()
	const others = await apiFeatures(Other, req.query, {})
	const total = await Other.countDocuments()

	res.status(200).json({
		status: 'success',
		total,
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

		if(req.body.mobileBanner) {
			const imageSize = getDataUrlSize(req.body.mobileBanner)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max mobileBanner size: 5MB(max)'))

			const { error: _avatarError, image: mobileBanner } = await fileService.handleBase64File(req.body.mobileBanner, '/others')
			if(mobileBanner) req.body.mobileBanner = mobileBanner
		}

		if(req.body.popupImageMobile) {
			// check file size
			const imageSize = getDataUrlSize(req.body.popupImageMobile)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max popupImageMobile size: 5MB(max)'))

			const { error: _avatarError, image: popupImageMobile } = await fileService.handleBase64File(req.body.popupImageMobile, '/others')
			if(popupImageMobile) req.body.popupImageMobile = popupImageMobile
		}

		if(req.body.logo) {
			const imageSize = getDataUrlSize(req.body.logo)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max logo size: 5MB(max)'))

			const { error: _avatarError, image: logo } = await fileService.handleBase64File(req.body.logo, '/others')
			if(logo) req.body.logo = logo
		}

		if(req.body.popupImage) {
			const imageSize = getDataUrlSize(req.body.logo)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max logo size: 5MB(max)'))

			const { error: _avatarError, image: popupImage } = await fileService.handleBase64File(req.body.popupImage, '/others')
			if(popupImage) req.body.popupImage = popupImage
		}

		const other = await Other.create(req.body)
		if(!other) return next(appError('no other document found'))

		res.status(201).json({
			status: 'success',
			data: other
		})

	} catch (err: unknown) {

		setTimeout(() => {
			if( !req.body.image?.secure_url?.startsWith('http') ) {
				promisify(fileService.removeFile)(req.body.image.secure_url)
			}
		}, 1000)
		setTimeout(() => {
			if( !req.body.mobileBanner?.secure_url?.startsWith('http') ) {
				promisify(fileService.removeFile)(req.body.mobileBanner.secure_url)
			}
		}, 1000)
		setTimeout(() => {
			if( !req.body.popupImageMobile?.secure_url?.startsWith('http') ) {
				promisify(fileService.removeFile)(req.body.popupImageMobile.secure_url)
			}
		}, 1000)
		setTimeout(() => {
			if( !req.body.logo?.secure_url?.startsWith('http') ) {
				promisify(fileService.removeFile)(req.body.logo.secure_url)
			}
		}, 1000)
		setTimeout(() => {
			if( !req.body.popupImage?.secure_url?.startsWith('http') ) {
				promisify(fileService.removeFile)(req.body.popupImage.secure_url)
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
		if(req.body.mobileBanner) {
			const imageSize = getDataUrlSize(req.body.mobileBanner)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max mobileBanner size: 5MB(max)'))

			const { error: _avatarError, image: mobileBanner } = await fileService.handleBase64File(req.body.mobileBanner, '/others')
			if(mobileBanner) req.body.mobileBanner = mobileBanner
		}

		if(req.body.popupImageMobile) {
			// check file size
			const imageSize = getDataUrlSize(req.body.popupImageMobile)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max popupImageMobile size: 5MB(max)'))

			const { error: _avatarError, image: popupImageMobile } = await fileService.handleBase64File(req.body.popupImageMobile, '/others')
			if(popupImageMobile) req.body.popupImageMobile = popupImageMobile
		}

		if(req.body.logo) {
			const imageSize = getDataUrlSize(req.body.logo)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max logo size: 5MB(max)'))

			const { error: _avatarError, image: logo } = await fileService.handleBase64File(req.body.logo, '/others')
			if(logo) req.body.logo = logo
		}

		if(req.body.popupImage) {
			const imageSize = getDataUrlSize(req.body.popupImage)
			const maxImageSize = 1024 * 1024 * 5 			// => 5 MB
			if(imageSize > maxImageSize) return next(appError('You cross the max logo size: 5MB(max)'))

			const { error: _avatarError, image: popupImage } = await fileService.handleBase64File(req.body.popupImage, '/others')
			if(popupImage) req.body.popupImage = popupImage
		}


		const other = await Other.findById(otherId )
		if(!other) return next(appError('product not found'))

		const updatedOther = await Other.findByIdAndUpdate(otherId, req.body, { new: true })
		if(!updatedOther) return next(appError('no other document update failed'))

		// delete old image
		if(req.body.image && other.image?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(other.image.secure_url)
			}, 1000);
		}

		if(req.body.mobileBanner && other.mobileBanner?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(req.body.mobileBanner.secure_url)
			}, 1000)
		}

		if(req.body.popupImageMobile && other.popupImageMobile?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(req.body.popupImageMobile.secure_url)
			}, 1000)
		}

		if(req.body.logo && other.logo?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(req.body.logo.secure_url)
			}, 1000)
		}

		if(req.body.popupImage && other.popupImage?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(req.body.popupImage.secure_url)
			}, 1000)
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

		setTimeout(() => {
			if( !req.body.mobileBanner?.secure_url?.startsWith('http') ) {
				promisify(fileService.removeFile)(req.body.mobileBanner.secure_url)
			}
		}, 1000)
		setTimeout(() => {
			if( !req.body.popupImageMobile?.secure_url?.startsWith('http') ) {
				promisify(fileService.removeFile)(req.body.popupImageMobile.secure_url)
			}
		}, 1000)
		setTimeout(() => {
			if( !req.body.logo?.secure_url?.startsWith('http') ) {
				promisify(fileService.removeFile)(req.body.logo.secure_url)
			}
		}, 1000)
		setTimeout(() => {
			if( !req.body.popupImage?.secure_url?.startsWith('http') ) {
				promisify(fileService.removeFile)(req.body.popupImage.secure_url)
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
		if(other?.image?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(other.image.secure_url)
			}, 1000);
		}

		if(other?.mobileBanner?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(req.body.mobileBanner.secure_url)
			}, 1000)
		}

		if(other?.popupImageMobile?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(req.body.popupImageMobile.secure_url)
			}, 1000)
		}

		if(other?.logo?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(req.body.logo.secure_url)
			}, 1000)
		}

		if(other?.popupImage?.secure_url) {
			setTimeout(() => {
				promisify(fileService.removeFile)(req.body.popupImage.secure_url)
			}, 1000)
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



